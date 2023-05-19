const { driver } = require("../lib/neo4j");
const { client } = require("../lib/redis");

async function createCommentToPost(content, author, postId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username}), (p:Post) WHERE id(p) = $postId CREATE (p)<-[:reply]-(c:Comment{content: $content, date: datetime()})<-[:commented]-(u) RETURN c`,
            { username: author, content, postId }
        );
        const comment = result.records[0].get("c");

        await client.del(`post:${postId}:comments`);
        await client.del(`post:${postId}:commentsCount`);

        return comment;
    } catch (error) {
        console.error(`Failed to create comment to post: ${error}`);
    } finally {
        await session.close();
    }
}

async function createCommentToComment(content, author, commentId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username}), (co:Comment)-[:reply*]->(p:Post) WHERE id(co) = $commentId CREATE (co)<-[:reply]-(c:Comment{content: $content, date: datetime()})<-[:commented]-(u) RETURN c, p`,
            { username: author, content, commentId }
        );
        const post = result.records[0].get("p");
        const postId = post.identity.low;
        await client.del(`post:${postId}:comments`);
        await client.del(`post:${postId}:commentsCount`);

        const comment = result.records[0].get("c");
        return comment;
    } catch (error) {
        console.error(`Failed to create comment to comment: ${error}`);
    } finally {
        await session.close();
    }
}

async function getCommentsByPost(postId) {
    const savedComments = await client.get(`post:${postId}:comments`);
    if (savedComments) {
        return JSON.parse(savedComments);
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (post:Post)<-[r:reply*]-(comment:Comment)<-[:commented]-(u:User) where id(post)=$postId RETURN comment, r, u ORDER BY comment.date DESC`,
            { postId: Number(postId) }
        );
        const mappedResult = result.records.map((r) => {
            return {
                r: r.get("r"),
                u: r.get("u"),
                comment: r.get("comment"),
            };
        });

        await client.set(
            `post:${postId}:comments`,
            JSON.stringify(mappedResult)
        );

        return mappedResult;
    } catch (error) {
        console.error(`Failed to get post by User: ${error}`);
    } finally {
        await session.close();
    }
}

async function getPostCommentsCount(id) {
    const savedCount = await client.get(`post:${id}:commentsCount`);
    if (savedCount) {
        return savedCount;
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match ()-[repl:reply*]->(post:Post) where id(post)=$id RETURN count(repl)`,
            { id: Number(id) }
        );

        const count = result.records[0].get("count(repl)").low;

        await client.set(`post:${id}:commentsCount`, count);

        return count;
    } catch (error) {
        console.error(`Failed to get post comments count: ${error}`)?.low;
    } finally {
        await session.close();
    }
}

module.exports = {
    createCommentToPost,
    createCommentToComment,
    getCommentsByPost,
    getPostCommentsCount,
};

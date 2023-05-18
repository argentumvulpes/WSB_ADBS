const { driver } = require("../lib/neo4j");

async function likePost(username, postId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username}), (p:Post) WHERE id(p) = $postId MERGE (u)-[:liked]->(p)`,
            { username, postId: Number(postId) }
        );
    } catch (error) {
        console.error(`Failed to like post: ${error}`);
    } finally {
        await session.close();
    }
}

async function unlikePost(username, postId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[l:liked]->(p:Post) WHERE id(p) = $postId DELETE l`,
            { username, postId: Number(postId) }
        );
    } catch (error) {
        console.error(`Failed to unlike post: ${error}`);
    } finally {
        await session.close();
    }
}

async function likeComment(username, commentId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username}), (co:Comment) WHERE id(co) = $commentId MERGE (u)-[:liked]->(co)`,
            { username, commentId: Number(commentId) }
        );
    } catch (error) {
        console.error(`Failed to like comment: ${error}`);
    } finally {
        await session.close();
    }
}

async function unlikeComment(username, commentId) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[l:liked]->(co:Comment) WHERE id(co) = $commentId DELETE l`,
            { username, commentId: Number(commentId) }
        );
    } catch (error) {
        console.error(`Failed to unlike comment: ${error}`);
    } finally {
        await session.close();
    }
}

async function getPostLikes(id, userLike) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (post:Post)
            WHERE id(post) = $id
            OPTIONAL MATCH ()-[lik:liked]->(post)
            WITH post, count(lik) AS totalLikes
            OPTIONAL MATCH (u:User)-[lik2:liked]->(post)
            WHERE id(u) = $userLike
            RETURN totalLikes, count(lik2) AS userLiked`,
            { id: Number(id), userLike: Number(userLike) }
        );

        return {
            total: result.records[0].get("totalLikes")?.low,
            userLike: result.records[0].get("userLiked")?.low,
        };
    } catch (error) {
        console.error(`Failed to get post likes: ${error}`);
    } finally {
        await session.close();
    }
}

async function getCommentLikes(id, userLike) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (comment:Comment)
            WHERE id(comment) = $id
            OPTIONAL MATCH ()-[lik:liked]->(comment)
            WITH comment, count(lik) AS totalLikes
            OPTIONAL MATCH (u:User)-[lik2:liked]->(comment)
            WHERE id(u) = $userLike
            RETURN totalLikes, count(lik2) AS userLiked`,
            { id: Number(id), userLike: Number(userLike) }
        );
        return {
            total: result.records[0].get("totalLikes")?.low,
            userLike: result.records[0].get("userLiked")?.low,
        };
    } catch (error) {
        console.error(`Failed to get comment likes: ${error}`);
    } finally {
        await session.close();
    }
}

module.exports = {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    getPostLikes,
    getCommentLikes,
};

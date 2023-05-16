const { driver } = require('../lib/neo4j')

async function createCommentToPost(content, author, postId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}), (p:Post) WHERE id(p) = $postId CREATE (p)<-[:reply]-(c:Comment{content: $content, date: datetime()})<-[:commented]-(u) RETURN c`,
            {username:author, content, postId}
        )
        const user1 = result.records[0].get('c')
        return user1

    } catch (error) {
        console.error(`Failed to create comment to post: ${error}`)
    } finally {
        await session.close()
    }
}

async function createCommentToComment(content, author, commentId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}), (co:Comment) WHERE id(co) = $commentId CREATE (co)<-[:reply]-(c:Comment{content: $content, date: datetime()})<-[:commented]-(u) RETURN c`,
            {username:author, content, commentId}
        )
        const user1 = result.records[0].get('c')
        return user1

    } catch (error) {
        console.error(`Failed to create comment to comment: ${error}`)
    } finally {
        await session.close()
    }
}

async function getCommentsByPost(postId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (post:Post)<-[r:reply*]-(comment:Comment) where id(post)=$postId RETURN comment, r ORDER BY comment.date DESC`,
            {postId}
        )
        return result.records.map(r => {
            return {
                r:r.get('r'), 
                comment:r.get('comment')
            }
        })
        

    } catch (error) {
        console.error(`Failed to get post by User: ${error}`)
    } finally {
        await session.close()
    }
}

async function getPostCommentsCount(id) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match ()-[repl:reply*]->(post:Post) where id(post)=$id RETURN count(repl)`,
            {id: Number(id)}
        )
        return result.records[0].get('count(repl)').low

    } catch (error) {
        console.error(`Failed to get post comments count: ${error}`)?.low
    } finally {
        await session.close()
    }
}


module.exports = { createCommentToPost,createCommentToComment, getCommentsByPost, getPostCommentsCount }

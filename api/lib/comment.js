const { driver } = require('./neo4j')

async function createCommentToPost(content, author, postId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}), (p:Post) WHERE id(p) = $postId CREATE (p)<-[:reply]-(c:Comment{content: $content})<-[:commented]-(u) RETURN c`,
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
            `Match (u:User {username: $username}), (co:Comment) WHERE id(co) = $commentId CREATE (co)<-[:reply]-(c:Comment{content: $content})<-[:commented]-(u) RETURN c`,
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


module.exports = { createCommentToPost,createCommentToComment }

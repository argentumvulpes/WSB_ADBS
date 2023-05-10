const { driver } = require('./neo4j')

async function likePost(username, postId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username}), (p:Post) WHERE id(p) = $postId MERGE (u)-[:liked]->(p) RETURN p`,
            {username, postId}
        )
        const like1 = result.records[0].get('p')
        return like1

    } catch (error) {
        console.error(`Failed to like post: ${error}`)
    } finally {
        await session.close()
    }
}

async function unlikePost(username, postId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[l:liked]->(p:Post) WHERE id(p) = $postId DELETE l`,
            {username, postId}
        )

    } catch (error) {
        console.error(`Failed to unlike post: ${error}`)
    } finally {
        await session.close()
    }
}

async function likeComment(username, commentId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username}), (co:Comment) WHERE id(co) = $commentId MERGE (u)-[:liked]->(co) RETURN co`,
            {username, commentId}
        )
        const like1 = result.records[0].get('co')
        return like1

    } catch (error) {
        console.error(`Failed to like comment: ${error}`)
    } finally {
        await session.close()
    }
}

async function unlikeComment(username, commentId) {

    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[l:liked]->(co:Comment) WHERE id(co) = $commentId DELETE l`,
            {username, commentId}
        )

    } catch (error) {
        console.error(`Failed to unlike comment: ${error}`)
    } finally {
        await session.close()
    }
}

module.exports = { likePost, unlikePost, likeComment, unlikeComment }

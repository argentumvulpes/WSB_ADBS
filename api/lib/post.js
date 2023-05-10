const { driver } = require('./neo4j')

async function createPost(content, author) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}) CREATE (post:Post {content: $content})<-[:posted]-(u) RETURN post`,
            {username:author, content}
        )
        const user1 = result.records[0].get('post')
        return user1

    } catch (error) {
        console.error(`Failed to create post: ${error}`)
    } finally {
        await session.close()
    }
}

async function getPostByID(id) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (post:Post)<-[:posted]-(author) where id(post)=$id RETURN post,author`,
            {id}
        )
        return {
            author: result.records[0].get('author'),
            post: result.records[0].get('post')
        }

    } catch (error) {
        console.error(`Failed to get post by ID: ${error}`)
    } finally {
        await session.close()
    }
}

async function getPostsByUser(user) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (post:Post)<-[:posted]-(author) where author.username=$user RETURN post`,
            {user}
        )
        return result.records.map(r => r.get('post'))
        

    } catch (error) {
        console.error(`Failed to get post by User: ${error}`)
    } finally {
        await session.close()
    }
}

module.exports = { createPost,getPostByID, getPostsByUser }

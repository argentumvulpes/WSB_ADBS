const { driver } = require('./neo4j')

async function createPost(content, author) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}) CREATE (post:Post {content: $content, date: datetime()})<-[:posted]-(u) RETURN post`,
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
            `Match (post:Post)<-[:posted]-(author:User) where author.username=$user RETURN post ORDER BY post.date DESC`,
            {user}
        )
        return result.records.map(r => r.get('post'))
        

    } catch (error) {
        console.error(`Failed to get post by User: ${error}`)
    } finally {
        await session.close()
    }
}

async function getPostsOfFollowedUsers(user) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username})-[:follow]->(fu:User)-[:posted]->(post:Post) RETURN post ORDER BY post.date DESC`,
            {username:user}
        )
        return result.records.map(r => r.get('post'))
        

    } catch (error) {
        console.error(`Failed to get post of followed Users: ${error}`)
    } finally {
        await session.close()
    }
}

module.exports = { createPost,getPostByID, getPostsByUser, getPostsOfFollowedUsers }

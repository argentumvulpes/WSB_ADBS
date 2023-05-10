const { driver } = require('./neo4j')

async function createUser(username, password) {

    const session = driver.session()
    try {
        const result = await session.run(
            `CREATE (u:User {username: $username, password: $password}) RETURN u`,
            { username, password }
        )
        const user1 = result.records[0].get('u')
        return user1

    } catch (error) {
        console.error(`Failed to create user: ${error}`)
    } finally {
        await session.close()
    }
}


async function getUser(username) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username}) RETURN u`,
            { username }
        )
        const user1 = result.records[0].get('u')
        return user1

    } catch (error) {
        console.error(`Failed to get user: ${error}`)
    } finally {
        await session.close()
    }
}
module.exports = { createUser, getUser }

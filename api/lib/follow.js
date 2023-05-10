const { driver } = require('./neo4j')

async function followUser(username, usernameToFollow) {

    const session = driver.session()
    try {
        if (username===usernameToFollow){
            throw new Error("Usernames are equal")
        }
        const result = await session.run(
            `MATCH (u:User {username: $username}), (uf:User {username: $usernameToFollow}) MERGE (u)-[:follow]->(uf) RETURN uf`,
            {username, usernameToFollow}
        )
        const follow1 = result.records[0].get('uf')
        return follow1

    } catch (error) {
        console.error(`Failed to follow user: ${error}`)
    } finally {
        await session.close()
    }
}

async function unfollowUser(username, usernameToFollow) {

    const session = driver.session()
    try {
        if (username===usernameToFollow){
            throw new Error("Usernames are equal")
        }
        const result = await session.run(
            `MATCH (u:User {username: $username})-[f:follow]->(uf:User {username: $usernameToFollow}) DELETE f`,
            {username, usernameToFollow}
        )

    } catch (error) {
        console.error(`Failed to unfollow user: ${error}`)
    } finally {
        await session.close()
    }
}

async function getFollowedByUser(user) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username})-[:follow]->(fu:User) RETURN fu`,
            {username:user}
        )
        return result.records.map(r => r.get('fu'))
        

    } catch (error) {
        console.error(`Failed to get followed Users by User: ${error}`)
    } finally {
        await session.close()
    }
}

async function getFollowingUsers(user) {

    const session = driver.session()
    try {
        const result = await session.run(
            `Match (u:User {username: $username})<-[:follow]-(fu:User) RETURN fu`,
            {username:user}
        )
        return result.records.map(r => r.get('fu'))
        

    } catch (error) {
        console.error(`Failed to get following Users: ${error}`)
    } finally {
        await session.close()
    }
}


module.exports = { followUser, unfollowUser, getFollowedByUser, getFollowingUsers }
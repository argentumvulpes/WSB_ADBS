const { driver } = require("../lib/neo4j");
const { client } = require("../lib/redis");

async function followUser(username, usernameToFollow) {
    const session = driver.session();
    try {
        if (username === usernameToFollow) {
            throw new Error("Usernames are equal");
        }
        const result = await session.run(
            `MATCH (u:User {username: $username}), (uf:User {username: $usernameToFollow}) MERGE (u)-[:follow]->(uf) RETURN uf`,
            { username, usernameToFollow }
        );

        await client.del(`user:${username}:followingCount`);
        await client.del(`user:${usernameToFollow}:followersCount`);

        const follow1 = result.records[0].get("uf");
        return follow1;
    } catch (error) {
        console.error(`Failed to follow user: ${error}`);
    } finally {
        await session.close();
    }
}

async function unfollowUser(username, usernameToFollow) {
    const session = driver.session();
    try {
        if (username === usernameToFollow) {
            throw new Error("Usernames are equal");
        }
        const result = await session.run(
            `MATCH (u:User {username: $username})-[f:follow]->(uf:User {username: $usernameToFollow}) DELETE f`,
            { username, usernameToFollow }
        );

        await client.del(`user:${username}:followingCount`);
        await client.del(`user:${usernameToFollow}:followersCount`);
    } catch (error) {
        console.error(`Failed to unfollow user: ${error}`);
    } finally {
        await session.close();
    }
}

async function getFollowedByUser(user) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username})-[:follow]->(fu:User) RETURN fu`,
            { username: user }
        );
        return result.records.map((r) => r.get("fu"));
    } catch (error) {
        console.error(`Failed to get followed Users by User: ${error}`);
    } finally {
        await session.close();
    }
}

async function getFollowingUsers(user) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username})<-[:follow]-(fu:User) RETURN fu`,
            { username: user }
        );
        return result.records.map((r) => r.get("fu"));
    } catch (error) {
        console.error(`Failed to get following Users: ${error}`);
    } finally {
        await session.close();
    }
}

async function getUserFollowersCount(username) {
    const savedCount = await client.get(`user:${username}:followersCount`);
    if (savedCount) {
        return savedCount;
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username})<-[fol:follow]-() RETURN count(fol)`,
            { username }
        );
        const count = result.records[0].get("count(fol)").low;

        await client.set(`user:${username}:followersCount`, count);

        return count;
    } catch (error) {
        console.error(`Failed to get user followers count ${error}`);
    } finally {
        await session.close();
    }
}

async function getUserFollowedCount(username) {
    const savedCount = await client.get(`user:${username}:followingCount`);
    if (savedCount) {
        return savedCount;
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username})-[fol:follow]->() RETURN count(fol)`,
            { username }
        );
        const count = result.records[0].get("count(fol)").low;

        await client.set(`user:${username}:followingCount`, count);

        return count;
    } catch (error) {
        console.error(`Failed to get user followed count ${error}`);
    } finally {
        await session.close();
    }
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowedByUser,
    getFollowingUsers,
    getUserFollowersCount,
    getUserFollowedCount,
};

const { driver } = require("../lib/neo4j");
const { client } = require("../lib/redis");

async function createUser(username, password) {
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE (u:User {username: $username, password: $password}) RETURN u`,
            { username, password }
        );
        const user1 = result.records[0].get("u");
        return user1;
    } catch (error) {
        console.error(`Failed to create user: ${error}`);
    } finally {
        await session.close();
    }
}

async function getUser(username) {
    const savedUser = await client.get(`user:${username}`);
    if (savedUser) {
        const user = JSON.parse(savedUser);
        return { user, error: null };
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username}) RETURN u`,
            { username }
        );
        const user1 = result.records[0]?.get("u");

        await client.set(`user:${username}`, JSON.stringify(user1));

        return { user: user1, error: null };
    } catch (error) {
        console.error(`Failed to get user: ${error}`);
        return { user: null, error };
    } finally {
        await session.close();
    }
}

async function getUserWithPosts(username, idIsFollowing) {
    const session = driver.session();

    const resultIsFollowing = await session.run(
        `MATCH (u:User)-[lik:follow]->(:User {username: $username})
        WHERE id(u) = $idIsFollowing
        RETURN count(lik) AS userFollow`,
        { idIsFollowing, username }
    );
    const isUserFollowing = resultIsFollowing.records[0].get('userFollow');

    const savedUser = await client.get(`user:${username}:userWithPosts`);
    if (savedUser) {
        return {user: JSON.parse(savedUser), isUserFollowing};
    }

    try {
        const result = await session.run(
            `Match (u:User {username: $username}) OPTIONAL MATCH (u)-[:posted]->(p:Post) RETURN u, p`,
            { username }
        );
        const all = result.records.map((r) => ({
            user: r.get("u"),
            post: r.get("p"),
        }));


        const user = { user: all[0].user, posts: all.map((a) => a.post) };
        delete user.user.properties.password;

        await client.set(`user:${username}:userWithPosts`, JSON.stringify(user));

        return {user, isUserFollowing};
    } catch (error) {
        console.error(`Failed to get user: ${error}`);
    } finally {
        await session.close();
    }
}

async function createConstraintIfNotExists() {
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE CONSTRAINT username IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE`
        );
    } catch (error) {
        console.error(`Failed to create constraint: ${error}`);
    } finally {
        await session.close();
    }
}

module.exports = {
    createUser,
    getUser,
    createConstraintIfNotExists,
    getUserWithPosts,
};

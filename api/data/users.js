const { driver } = require('../lib/neo4j');

async function createUser(username, password) {
  const session = driver.session();
  try {
    const result = await session.run(
      `CREATE (u:User {username: $username, password: $password}) RETURN u`,
      { username, password }
    );
    const user1 = result.records[0].get('u');
    return user1;
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
  } finally {
    await session.close();
  }
}

async function getUser(username) {
  const session = driver.session();
  try {
    const result = await session.run(
      `Match (u:User {username: $username}) RETURN u`,
      { username }
    );
    const user1 = result.records[0]?.get('u');
    return { user: user1, error: null };
  } catch (error) {
    console.error(`Failed to get user: ${error}`);
    return { user: null, error };
  } finally {
    await session.close();
  }
}

async function getUserWithPosts(username) {
  const session = driver.session();
  try {
    const result = await session.run(
      `Match (u:User {username: $username})-[:posted]->(p:Post) RETURN u, p`,
      { username }
    );
    const all = result.records.map((r) => ({
      user: r.get('u'),
      post: r.get('p'),
    }));

    const user = { user: all[0].user, posts: all.map((a) => a.post) }
    delete user.user.properties.password

    return user;
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

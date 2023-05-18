const { driver } = require("../lib/neo4j");
const { client } = require("../lib/redis");

async function createPost(content, author) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User {username: $username}) CREATE (post:Post {content: $content, date: datetime()})<-[:posted]-(u) RETURN post`,
            { username: author, content }
        );
        const post = result.records[0].get("post");
        await client.del(`user:${author}:posts`);
        await client.del(`user:${author}:userWithPosts`);

        return post;
    } catch (error) {
        console.error(`Failed to create post: ${error}`);
    } finally {
        await session.close();
    }
}

async function getPostByID(id) {
    const savedPost = await client.get(`post:${id}`);
    if (savedComments) {
        return JSON.parse(savedPost);
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (post:Post)<-[:posted]-(author) where id(post)=$id RETURN post,author`,
            { id }
        );
        const res = {
            author: result.records[0].get("author"),
            post: result.records[0].get("post"),
        };
        await client.set(`post:${id}`, JSON.stringify(res));
        return res;
    } catch (error) {
        console.error(`Failed to get post by ID: ${error}`);
    } finally {
        await session.close();
    }
}

async function getPostsByUser(user) {
    const savedPosts = await client.get(`user:${user}:posts`);
    if (savedPosts) {
        return JSON.parse(savedPosts);
    }

    const session = driver.session();
    try {
        const result = await session.run(
            `Match (post:Post)<-[:posted]-(author:User) where author.username=$user RETURN post ORDER BY post.date DESC`,
            { user }
        );
        const mappedResult = result.records.map((r) => r.get("post"));
        await client.set(`user:${user}:posts`, JSON.stringify(mappedResult));

        return mappedResult;
    } catch (error) {
        console.error(`Failed to get post by User: ${error}`);
    } finally {
        await session.close();
    }
}

async function getPostsOfFollowedUsers(user) {
    const session = driver.session();
    try {
        const result = await session.run(
            `Match (u:User)-[:follow]->(fu:User)-[:posted]->(post:Post) WHERE u.username = $username OR fu.username = $username RETURN post, fu ORDER BY post.date DESC`,
            { username: user }
        );
        return result.records.map((r) => ({
            post: r.get("post"),
            user: r.get("fu"),
        }));
    } catch (error) {
        console.error(`Failed to get post of followed Users: ${error}`);
    } finally {
        await session.close();
    }
}

async function deletePost(postId) {
  const session = driver.session();
  try {
      const result = await session.run(
          `Match (p:Post)<-[post:posted]-(author:User) WHERE id(p) = $postId OPTIONAL MATCH (p:Post)<-[r:reply*]-(c:Comment) DETACH DELETE p, c RETURN author`,
          { postId: Number(postId) }
      );
      const post = result.records[0].get("author");
      const userName = post.properties.username

      await client.del(`user:${userName}:posts`);
      await client.del(`user:${userName}:userWithPosts`);

  } catch (error) {
      console.error(`Failed to delete post: ${error}`);
  } finally {
      await session.close();
  }
}

module.exports = {
    createPost,
    getPostByID,
    getPostsByUser,
    getPostsOfFollowedUsers,
    deletePost
};

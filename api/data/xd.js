const { client } = require('../lib/redis')
const { getPostLikes, getCommentLikes } = require('./like');
const { getUserFollowedCount, getUserFollowersCount } = require('./follow');
const { getPostCommentsCount } = require('./comment');



async function overwritePostsLikes(postId, userLike) {
    setInterval(async () => {
        try {
            const { total } = await getPostLikes(postId, userLike);
            await client.set(`likes:${postId}`, total);
            console.log(`Likes for post ${postId} saved to Redis.`);
        } catch (error) {
            console.error(`Failed to save likes to Redis: ${error}`);
        }
    }, 2000);
}

async function overwriteCommentsLikes(commentId) {
    setInterval(async () => {
        try {
            const { total } = await getCommentLikes(commentId);
            await client.set(`likes:${commentId}`, total);
            console.log(`Likes for post ${commentId} saved to Redis.`);
        } catch (error) {
            console.error(`Failed to save likes to Redis: ${error}`);
        }
    }, 2000);
}

async function overwriteFollowersCount(username) {
    setInterval(async () => {
        try {
            const followersCount = await getUserFollowersCount(username);
            await client.set(`followersCount:${username}`, followersCount);
            console.log(`Followers count for user ${username} saved to Redis.`);
        } catch (error) {
            console.error(`Failed to save followers count to Redis: ${error}`);
        }
    }, 2000);
}

async function overwriteFollowedCount(username) {
    setInterval(async () => {
        try {
            const followedCount = await getUserFollowedCount(username);
            await client.set(`followedCount:${username}`, followedCount);
            console.log(`Followed count for user ${username} saved to Redis.`);
        } catch (error) {
            console.error(`Failed to save followed count to Redis: ${error}`);
        }
    }, 2000);
}

async function overwriteCommentsCount(postId) {
    setInterval(async () => {
        try {
            const commentsCount = await getPostCommentsCount(postId);
            await client.set(`commentsCount:${postId}`, commentsCount);
            console.log(`Comments count for post ${postId} saved to Redis.`);
          } catch (error) {
            console.error(`Failed to save comments count to Redis: ${error}`);
          }
    }, 2000);
}

module.exports = { overwritePostsLikes, overwriteCommentsLikes, overwriteFollowersCount, overwriteFollowedCount, overwriteCommentsCount }

const { createUser, getUser } = require('./lib/users')
const { createPost,getPostByID, getPostsByUser, getPostsOfFollowedUsers } = require('./lib/post')
const { likePost, unlikePost, likeComment,unlikeComment } = require('./lib/like')
const { createCommentToPost,createCommentToComment, getCommentsByPost } = require('./lib/comment')
const { followUser, unfollowUser, getFollowedByUser, getFollowingUsers } = require('./lib/follow')
const express = require('express')
const app = express()
const port = 3000


app.get('/', async (req, res) => {

    // const user1 = await createUser("bbb", "bbb")
    // console.log(user1)
    // const post = await getFollowingUsers("xxx")
    // console.log(post)
    // const post = await createPost("xdddddddddd", "xxx")
    // console.log(post)
    // const like = await likeComment("xxx", 11)
    // console.log(like)
    // await unlikeComment("xxx", 11)
    // const comment1 = await createCommentToPost("xd", "aaa", 4)
    // console.log(comment1)
    // const comment = await createCommentToComment("a", "bbb", 8)
    // console.log(comment)
    // const follow = await followUser("bbb", "xxx")
    // console.log(follow)
    const comment = await getCommentsByPost(4)
    console.log(comment)

    res.send(comment)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



process.on('SIGTERM', async () => {
    await server.close()
})
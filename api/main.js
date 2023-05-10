const { createUser, getUser } = require('./lib/users')
const { createPost,getPostByID, getPostsByUser } = require('./lib/post')
const { likePost, unlikePost, likeComment,unlikeComment } = require('./lib/like')
const { createCommentToPost,createCommentToComment } = require('./lib/comment')
const { followUser, unfollowUser } = require('./lib/follow')
const express = require('express')
const app = express()
const port = 3000


app.get('/', async (req, res) => {

    // const user1 = await createUser("aaa", "yyy")
    // console.log(user1)
    // const post = await getPostsByUser("xxx")
    // console.log(post)
    // const post = await createPost("sjdcbjd", "xxx")
    // console.log(post)
    // const like = await likeComment("xxx", 11)
    // console.log(like)
    // await unlikeComment("xxx", 11)
    // const comment = await createCommentToComment("xd", "xxx", 10)
    // console.log(comment)
    const follow = await unfollowUser("xxx", "aaa")
    console.log(follow)
    res.send("ok")

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



process.on('SIGTERM', async () => {
    await server.close()
})
const express = require("express");
const router = express.Router();

const {
    getPostLikes,
    unlikePost,
    likePost,
    likeComment,
    unlikeComment,
    getCommentLikes,
} = require("../data/like");

router.get("/post/:postId", async (req, res) => {
    const likes = await getPostLikes(req.params.postId, req.user?.identity.low);
    res.send({ likes });
});

router.get("/comment/:commentId", async (req, res) => {
    const likes = await getCommentLikes(
        req.params.commentId,
        req.user?.identity.low
    );
    res.send({ likes });
});

router.post("/post/:postId/like", async (req, res) => {
    await likePost(req.user?.properties.username, req.params.postId);
    res.send("ok");
});

router.post("/post/:postId/unlike", async (req, res) => {
    await unlikePost(req.user?.properties.username, req.params.postId);
    res.send("ok");
});

router.post("/comment/:commentId/like", async (req, res) => {
    await likeComment(req.user?.properties.username, req.params.commentId);
    res.send("ok");
});

router.post("/comment/:commentId/unlike", async (req, res) => {
    await unlikeComment(req.user?.properties.username, req.params.commentId);
    res.send("ok");
});

module.exports = router;

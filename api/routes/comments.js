const express = require("express");
const router = express.Router();

const { getPostCommentsCount, getCommentsByPost } = require("../data/comment");

router.get("/post/:postId/count", async (req, res) => {
    const count = await getPostCommentsCount(req.params.postId);
    res.send({ count });
});

router.get("/post/:postId", async (req, res) => {
    const comments = await getCommentsByPost(req.params.postId);

    res.send(comments);
});

module.exports = router;

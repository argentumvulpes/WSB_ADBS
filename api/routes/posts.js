const express = require("express");
const router = express.Router();

const { getPostsOfFollowedUsers, createPost, deletePost } = require("../data/post");

router.get("/main", async (req, res) => {
    const posts = await getPostsOfFollowedUsers(req.user?.properties.username);
    res.send({ posts });
});

router.post("/post", async (req, res) => {
  const post = await createPost(req.body.content, req.user?.properties.username);
  res.send({ post });
});

router.post("/:postId/delete", async (req, res) => {
  await deletePost(req.params.postId);
  res.send('ok');
});



module.exports = router;

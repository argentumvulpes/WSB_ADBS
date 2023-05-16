const express = require('express');
const router = express.Router();

const { getPostLikes } = require('../data/like');

router.get('/post/:postId', async (req, res) => {
  const likes = await getPostLikes(req.params.postId, req.user?.identity.low);
  res.send({likes});
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { getPostCommentsCount } = require('../data/comment');

router.get('/post/:postId', async (req, res) => {
  const count = await getPostCommentsCount(req.params.postId);
  res.send({count});
});

module.exports = router;

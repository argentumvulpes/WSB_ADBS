const express = require('express');
const router = express.Router();

const { getPostsOfFollowedUsers } = require('../data/post');

router.get('/main', async (req, res) => {
  const posts = await getPostsOfFollowedUsers(req.user?.properties.username);
  res.send({posts});
});

module.exports = router;

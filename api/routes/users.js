const express = require('express');
const router = express.Router();

const { getUserWithPosts } = require('../data/users');

// get user by name
router.get('/:userName', async (req, res) => {
  const user = await getUserWithPosts(req.params.userName);
  res.send(user);
});

module.exports = router;

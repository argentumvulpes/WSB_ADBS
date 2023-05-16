const express = require('express');
const router = express.Router();

const { getUserFollowersCount, getUserFollowedCount } = require('../data/follow');

router.get('/followers/:username', async (req, res) => {
  const followers = await getUserFollowersCount(req.params.username);
  res.send({followers});
});

router.get('/followed/:username', async (req, res) => {
    const followed = await getUserFollowedCount(req.params.username);
    res.send({followed});
  });

module.exports = router;

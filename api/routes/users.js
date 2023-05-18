const express = require("express");
const router = express.Router();

const { getUserWithPosts } = require("../data/users");
const { followUser, unfollowUser } = require("../data/follow");

// get user by name
router.get("/:userName", async (req, res) => {
    const user = await getUserWithPosts(req.params.userName, req.user?.identity.low);
    res.send(user);
});

router.post("/:userName/follow", async (req, res) => {
  await followUser(req.user?.properties.username, req.params.userName);
  res.send('ok');
});

router.post("/:userName/unfollow", async (req, res) => {
  await unfollowUser(req.user?.properties.username, req.params.userName);
  res.send('ok');
});


module.exports = router;

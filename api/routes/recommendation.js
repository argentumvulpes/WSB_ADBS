const express = require("express");
const router = express.Router();

const { recommendationForUser } = require("../data/recommendation");

router.get("/users", async (req, res) => {
    const users = await recommendationForUser(req.user?.properties.username);
    res.send(users);
});

module.exports = router;

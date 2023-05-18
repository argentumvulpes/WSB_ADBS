const express = require("express");
const router = express.Router();

const { searchByPhrase } = require("../data/search");

router.get("/", async (req, res) => {
    const posts = await searchByPhrase(req.query.query);
    res.send(posts);
});

module.exports = router;

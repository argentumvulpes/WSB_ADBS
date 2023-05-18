const { createClient } = require("redis");

// docker run --name redis-stack -d -p 6379:6379 -p 8001:8001 -v "C:/Docker/Redis/data:/data" redis/redis-stack

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect().then(() => {
    console.log("Redis connected");
});

process.on("SIGTERM", async () => {
    await client.disconnect();
});

module.exports = { client };

const { driver } = require("../lib/neo4j");
const { client } = require("../lib/redis");

async function recommendationForUser(username) {
    const session = driver.session();

    const graphCreated = await client.get(`rGraph:created`);

    try {
        if (!graphCreated) {
            try {
                await session.run('CALL gds.graph.drop("rGraph")');
            } catch (e) {}
            await session.run(
                `CALL gds.graph.project("rGraph", ['User', 'Post', 'Comment'], {
                  LIKED: {
                    type: 'liked',
                    orientation: 'UNDIRECTED'
                  },
                  REPLY: {
                    type: 'reply',
                    orientation: 'UNDIRECTED'
                  },
                  POSTED: {
                    type: 'posted',
                    orientation: 'UNDIRECTED'
                  },
                  COMMENTED: {
                    type: 'commented',
                    orientation: 'UNDIRECTED'
                  }
              })`
            );

            await client.set(`rGraph:created`, 1);
            await client.expire(`rGraph:created`, 120);
        }

        const result = await session.run(
            `MATCH (u1:User{username:$username}) WITH u1
        CALL gds.pageRank.stream(
          "rGraph", {sourceNodes: [id(u1)]}
        )
        YIELD
          nodeId,score
        MATCH (u:User) WHERE id(u) = nodeId AND score > 0.015 AND NOT id(u) = id(u1) AND NOT (u1)-[:follow]->(u)
        RETURN u, score ORDER BY score DESC LIMIT 3`,
            { username }
        );
        return result.records.map((record) => {
            return {
                userId: record.get("u"),
                score: record.get("score"),
            };
        });
    } catch (error) {
        console.error(`Failed to get recommendations: ${error}`);
    } finally {
        await session.close();
    }
}

module.exports = { recommendationForUser };

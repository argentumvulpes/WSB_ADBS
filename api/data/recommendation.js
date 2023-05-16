const { driver } = require('../lib/neo4j');

async function recommendationForUser(username) {
  const session = driver.session();

  try {
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
    const result = await session.run(
      `MATCH (u1:User{username:$username}) WITH u1
        CALL gds.pageRank.stream(
          "rGraph", {sourceNodes: [id(u1)]}
        )
        YIELD
          nodeId,score
        MATCH (u:User) WHERE id(u) = nodeId AND NOT id(u) = id(u1) AND NOT (u1)-[:follow]->(u)
        RETURN u, score ORDER BY score DESC LIMIT 3`,
      { username }
    );
    return result.records.map((record) => {
      return {
        userId: record.get('u'),
        score: record.get('score'),
      };
    });
  } catch (error) {
    console.error(`Failed to get recommendations: ${error}`);
  } finally {
    await session.close();
  }
}

module.exports = { recommendationForUser };

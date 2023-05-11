const { driver } = require('./neo4j')


// funkcja rekomendacji osób do obserwowania
async function recommendationForUser(userId) {

    const session = driver.session();
  
    try {
      // wykonujemy zapytanie do bazy danych Neo4j z użyciem algorytmu PageRank
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:liked|commented]->(p:Post)<-[:liked|commented]-(f:User)
        WHERE NOT (u)-[:follow]->(f) AND f.id <> u.id
        WITH DISTINCT f
        CALL gds.pageRank.stream('User', 'liked|commented', {sourceNodes: [u.id], dampingFactor: 0.85, iterations: 20, weightProperty: 'weight'})
        YIELD nodeId, score
        MATCH (f:User {id: toInteger(nodeId)})
        RETURN f.id as userId, score
        ORDER BY score DESC
        LIMIT 10`,
        {userId}
      );
  
      // zwracamy wynik zapytania w formacie obiektu JSON
      return result.records.map(record => {
        return {
          userId: record.get('userId'),
          score: record.get('score')
        }
      });
    } finally {
      // zamykamy sesję i połączenie z bazą danych Neo4j
      await session.close();
    }
  }

module.exports = { recommendationForUser }
const { driver } = require("../lib/neo4j");

async function searchByPhrase(phrase, fuzziness = 0.3) {
    if (phrase.indexOf(" ") !== -1) {
        phrase = `"${phrase}"`;
    }
    phrase = `${phrase}~${fuzziness}`;
    const session = driver.session();
    try {
        const result = await session.run(
            //`CALL db.index.fulltext.queryNodes("content", '"'+$phrase+'"~0.3') YIELD node RETURN node`,
            `CALL db.index.fulltext.queryNodes("content", $phrase) YIELD node MATCH (node)<-[:posted]-(u:User) RETURN node, u`,
            { phrase }
        );
        return result.records.map((r) => ({author: r.get("u"), post: r.get("node")}));
    } catch (error) {
        console.error(`Failed to get post by phrase: ${error}`);
    } finally {
        await session.close();
    }
}

async function createIndexIfNotExists() {
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE FULLTEXT INDEX content IF NOT EXISTS FOR (n:Post) ON EACH [n.content]`
        );
    } catch (error) {
        console.error(`Failed to create index: ${error}`);
    } finally {
        await session.close();
    }
}

module.exports = { searchByPhrase, createIndexIfNotExists };

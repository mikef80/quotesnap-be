//if you are testing outisde of test file - with insomnia for example, run the seed file
//to reset the database back to the base state.

const allCategories = require("./data/categoryData");
const allQuotes = require("./data/quoteData");
const allUsers = require("./data/userdata");
const { mongoLink, mongoDbName } = require("./testMongoDB");

const MongoClient = require("mongodb").MongoClient;

async function seedDB(mongoLink, mongoDbName, allUsers, allCategories, allQuotes) {
  const client = new MongoClient(mongoLink);
  try {
    await client.connect();
    const mngdb = client.db(mongoDbName);
    await mngdb.dropDatabase();
    await mngdb.createCollection("Quotes");
    await mngdb.createCollection("Users");
    await mngdb.createCollection("Categories");

    await mngdb.collection("Users").insertMany(allUsers);
    await mngdb.collection("Categories").insertMany(allCategories);
    await mngdb.collection("Quotes").insertMany(allQuotes);
  } catch {
  } finally {
    await client.close();
  }
}

seedDB(mongoLink, mongoDbName, allUsers, allCategories, allQuotes);

module.exports = seedDB;

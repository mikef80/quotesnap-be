//if you are testing outisde of test file - with insomnia for example, run the seed file 
//to reset the database back to the base state.

const allCategories = require("./data/categoryData");
const allQuotes = require("./data/quoteData");
const allUsers = require("./data/userdata");
const { mongoLink, mongoDbName } = require("./testMongoDB");

const MongoClient = require("mongodb").MongoClient;

async function seedDB(mongoLink,mongoDbName, allUsers, allCategories, allQuotes) {
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
    const catsForSeed = await mngdb.collection("Categories").find({}).toArray();
    const usersForSeed = await mngdb.collection("Users").find({}).toArray();

    for (const quote of allQuotes) {
      for (const user of usersForSeed) {
        if (user.username === quote.quoteUser) {
          quote.userId = user._id;
          delete quote.quoteUser;
        }
      }
      for (const cat of catsForSeed) {
        if (cat.categoryName === quote.quoteCategory) {
          quote.categoryId = cat._id;
          delete quote.quoteCategory;
        }
      }
    }
    await mngdb.collection("Quotes").insertMany(allQuotes);
  } catch {
  } finally {
    await client.close();
  }
}

seedDB(mongoLink,mongoDbName, allUsers, allCategories, allQuotes);

module.exports = seedDB;

const MongoClient = require("mongodb").MongoClient;
const { selectCategories } = require("../models/categories.model");
const { mongoLink, mongoDbName } = require("../testMongoDB");

const client = new MongoClient(mongoLink);

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await selectCategories(client, mongoDbName);
    res.status(200).send({ categories });
  } catch (next) {
  } finally {
    await client.close();
  }
};

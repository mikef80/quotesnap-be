const MongoClient = require("mongodb").MongoClient;
const { selectQuotes } = require("../models/quotes.model");
const { mongoLink, mongoDbName } = require("../testMongoDB");

const client = new MongoClient(mongoLink);

exports.getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await selectQuotes(client, mongoDbName);
    res.status(200).send({ quotes });
  } catch (next) {
  } finally {
    await client.close();
  }
};
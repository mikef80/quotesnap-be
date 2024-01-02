const MongoClient = require("mongodb").MongoClient;
const { selectQuotes, selectQuoteByQuoteId } = require("../models/quotes.model");
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

exports.getQuoteById = async (req, res, next) => {
  const { quoteId } = req.params;
  try {
    const quote = await selectQuoteByQuoteId(client, mongoDbName, quoteId);
    console.log(quote)
    if (!quote) res.status(404).send({ msg: "Quote not found!" });
    res.status(200).send({ quote });
  } catch (next) {
  } finally {
    await client.close();
  }
}
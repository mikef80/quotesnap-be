const MongoClient = require("mongodb").MongoClient;
const {
  selectQuotes,
  createNewQuote,
  selectQuoteByQuoteId,
  removeQuoteById,
} = require("../models/quotes.model");
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

exports.postNewQuote = async (req, res, next) => {
  const quoteInfo = req.body;
  [
    "quoteText",
    "quoteAuthor",
    "quoteOrigin",
    "quoteLocation",
    "quoteImage",
    "quoteIsPrivate",
    "quoteCategory",
    "quoteUser",
  ].forEach((key) => {
    if (!Object.keys(quoteInfo).includes(key)) {
      res.status(400).send({ msg: "Bad request!" });
    }
  });

  try {
    const newQuote = await createNewQuote(client, mongoDbName, quoteInfo);

    if (!newQuote || newQuote === null) {
      res.status(400).send({ msg: "Bad request - username not found" });
    }
    res.status(201).send({ quote: newQuote });
  } catch (next) {
  } finally {
    await client.close();
  }
};

exports.getQuoteById = async (req, res, next) => {
  const { quote_id } = req.params;
  const hexRegex = /^[0-9a-fA-F]{24}$/;

  if (hexRegex.test(quote_id)) {
    try {
      const quote = await selectQuoteByQuoteId(client, mongoDbName, quote_id);
      if (!quote) res.status(404).send({ msg: "Quote not found!" });
      res.status(200).send({ quote });
    } catch (next) {
    } finally {
      await client.close();
    }
  } else {
    res.status(400).send({ msg: "Invalid ID!" });
  }
};

exports.deleteQuoteById = async (id) => {
  removeQuoteById(id);
};

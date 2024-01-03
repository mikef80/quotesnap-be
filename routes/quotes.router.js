const { getAllQuotes, postNewQuote, getQuoteById } = require("../controllers/quotes.controller");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(getAllQuotes).post(postNewQuote);
quotesRouter.route("/:quote_id").get(getQuoteById);

module.exports = quotesRouter;

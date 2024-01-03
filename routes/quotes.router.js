const { getAllQuotes, postNewQuote } = require("../controllers/quotes.controller");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(getAllQuotes).post(postNewQuote);

module.exports = quotesRouter;

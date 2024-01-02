const { getAllQuotes, getQuoteById } = require("../controllers/quotes.controller");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(getAllQuotes);

quotesRouter.route("/:quoteId").get(getQuoteById)

module.exports = quotesRouter;

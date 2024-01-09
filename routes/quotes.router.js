const {
  getAllQuotes,
  postNewQuote,
  getQuoteById,
  deleteQuoteById,
} = require("../controllers/quotes.controller");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(getAllQuotes).post(postNewQuote);
quotesRouter.route("/:quote_id").get(getQuoteById);
quotesRouter.route("/:quote_id").delete(deleteQuoteById);

module.exports = quotesRouter;

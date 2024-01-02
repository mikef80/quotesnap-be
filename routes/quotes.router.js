const { getAllQuotes } = require("../controllers/quotes.controller");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(getAllQuotes);

module.exports = quotesRouter;

const categoriesRouter = require("./categories.router");
const quotesRouter = require("./quotes.router");
const usersRouter = require("./users.router");

const apiRouter = require("express").Router();

// apiRouter.use("/categories", categoriesRouter);
// apiRouter.use("/quotes", quotesRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;

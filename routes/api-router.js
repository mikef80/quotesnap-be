const apiRouter = require("express").Router();
const users = require("./users-router");

apiRouter.use("/users", users);

module.exports = apiRouter;

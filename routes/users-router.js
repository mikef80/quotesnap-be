const usersRouter = require("express").Router();
const getAllUsers = require("../api/controller/usersController");

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;

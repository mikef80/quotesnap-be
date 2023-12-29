const { getAllUsers, postNewUser, getUserByUsername } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/:username").get(getUserByUsername);
usersRouter.route("/").get(getAllUsers).post(postNewUser);

module.exports = usersRouter;

const {
  getAllUsers,
  postNewUser,
  getUserByUsername,
  patchUserByUsername,
  deleteUserByUsername,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/:username").get(getUserByUsername).patch(patchUserByUsername).delete(deleteUserByUsername);
usersRouter.route("/").get(getAllUsers).post(postNewUser);

module.exports = usersRouter;

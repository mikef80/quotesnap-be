const selectAllUsers = require("../models/usersModel");

const getAllUsers = (req, res) => {
  console.log("from controller");
  selectAllUsers();
  res.status(200).send("success");
};

module.exports = getAllUsers;

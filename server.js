const app = require("./app");
const mongoose = require("mongoose");
const { mongoLink } = require("./testMongoDB");

//routes

mongoose
  .connect(mongoLink)
  .then(() => {
    console.log("connected to mongo db");
    app.listen(3000, () => {
      console.log("Running on port 3000");
    });
  })
  .catch(() => {
    console.log("error");
  });

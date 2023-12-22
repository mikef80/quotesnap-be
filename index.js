const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use("/api", routes);

const mongoString = "mongodb://localhost:27017/quotesnap";

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  app.listen(3000, () => {
    console.log("Server started at PORT 3000");
  });
  console.log("DB connected!");
});

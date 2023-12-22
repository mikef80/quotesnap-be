const express = require("express");
const apiRouter = require("./routes/api-router");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("Server started at PORT 3000");
});

module.exports = app;

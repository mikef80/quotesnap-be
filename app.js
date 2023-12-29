const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

app.use("/api", apiRouter);

module.exports = app;

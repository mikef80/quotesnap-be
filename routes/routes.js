const express = require("express");
const router = express.Router();
const Model = require("../models/model");

router.post("/post", async (req, res) => {
  const data = new Model({
    name: req.body.name,
    age: req.body.age,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get("/", (req, res) => {
  res.send("success");
});

router.get("/getOne/:id", (req, res) => {
  res.send(req.params.id);
});

module.exports = router;

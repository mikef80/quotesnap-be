const MongoClient = require("mongodb").MongoClient;
const { selectCategories } = require("../models/categories.model");
const { mongoLink, mongoDbName } = require("../testMongoDB");
const { createCategory } = require("../models/categories.model");

const client = new MongoClient(mongoLink);

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await selectCategories(client, mongoDbName);
    res.status(200).send({ categories });
  } catch (next) {
  } finally {
    await client.close();
  }
};
exports.postCategories = async (req, res, next) => {
  const categoryName = req.body.categoryName;

  try {
    const category = await createCategory(client, mongoDbName, categoryName);

    if (category === null) {
      res.status(400).send({ msg: "Bad Request" });
    }

    res.status(201).send({ category: category });
  } catch {
  } finally {
    await client.close();
  }
};

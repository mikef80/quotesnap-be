const { mongoDbName } = require("../testMongoDB");

exports.selectCategories = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Categories").find({}).toArray();
};

exports.createCategory = async (client, mongoDbName, categoryName) => {
  await client.connect();

  const categoryExists = await client
    .db(mongoDbName)
    .collection("Categories")
    .findOne({ categoryName: categoryName });

  if (categoryExists) {
    return null;
  }
  const newCategory = await client
    .db(mongoDbName)
    .collection("Categories")
    .insertOne({ categoryName: categoryName })
    .then((res) => {
      return client
        .db(mongoDbName)
        .collection("Categories")
        .findOne({ _id: res.insertedId });
    });
  return newCategory;
};

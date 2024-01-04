exports.selectCategories = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Categories").find({}).toArray();
};

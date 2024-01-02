exports.selectQuotes = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Quotes").find({}).toArray();
};
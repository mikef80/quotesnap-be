exports.selectQuotes = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Quotes").find({}).toArray();
};

exports.selectQuoteByQuoteId = async (client, mongoDbName, quoteId) => {
  console.log("hello from model", quoteId);
  await client.connect();
  return client.db(mongoDbName).collection("Quotes").findOne({ quoteId });
};

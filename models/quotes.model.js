const { ObjectId } = require("bson");
const { selectUserByUsername } = require("./users.model");
const { mongoDbName } = require("../testMongoDB");

exports.selectQuotes = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Quotes").find({}).toArray();
};

exports.createNewQuote = async (client, mongoDbName, quoteInfo) => {
  await client.connect();

  const userExists = await selectUserByUsername(
    client,
    mongoDbName,
    quoteInfo.quoteUser
  );

  if (userExists) {
    const quoteInserted = await client
      .db(mongoDbName)
      .collection("Quotes")
      .insertOne(quoteInfo)
      .then((result) => {
        return client
          .db(mongoDbName)
          .collection("Quotes")
          .findOne({ _id: result.insertedId });
      });

    return quoteInserted;
  }

  return null;
};

exports.selectQuoteByQuoteId = async (client, mongoDbName, quoteId) => {
  await client.connect();
  const tempId = new ObjectId(quoteId);
  return client.db(mongoDbName).collection("Quotes").findOne({ _id: tempId });
};

exports.removeQuoteByQuoteId = async (client, mongoDbName, quoteId) => {
  await client.connect();
  const tempId = new ObjectId(quoteId);
  return client.db(mongoDbName).collection("Quotes").deleteOne({ _id: tempId });
};

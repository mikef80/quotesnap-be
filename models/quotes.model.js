const { selectUserByUsername } = require("./users.model");

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

exports.selectUsers = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").find({}).toArray();
};

exports.createNewUser = async (client, mongoDbName, userInfo) => {
  await client.connect();
  const userExists = await this.selectUserByUsername(client, mongoDbName, userInfo.username);
  if (userExists) return null;
  const newUser = await client
    .db(mongoDbName)
    .collection("Users")
    .insertOne(userInfo)
    .then((res) => {
      return client.db(mongoDbName).collection("Users").findOne({ _id: res.insertedId });
    });
  return newUser;
};

exports.selectUserByUsername = async (client, mongoDbName, username) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").findOne({ username });
};

exports.updateUserByUsername = async (client, mongoDbName, username, updateInfo) => {
  await client.connect();
  return client
    .db(mongoDbName)
    .collection("Users")
    .findOneAndUpdate({ username }, { $set: updateInfo }, { returnDocument: "after" });
};

exports.removeUserByUsername = async (client, mongoDbName, username) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").deleteOne({ username });
};

exports.selectQuotesByUsername = async (client, mongoDbName, username) => {
  await client.connect();
  const userExists = await this.selectUserByUsername(client, mongoDbName, username);
  if (userExists) return client.db(mongoDbName).collection("Quotes").find({ quoteUser: username }).toArray();
  else return null
};

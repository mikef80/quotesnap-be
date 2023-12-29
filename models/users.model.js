exports.selectUsers = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").find({}).toArray();
};

exports.createNewUser = async (client, mongoDbName, userInfo) => {
  await client.connect();
  const userExists = await client.db(mongoDbName).collection("Users").findOne({ username: userInfo.username });
  if (userExists) return null;
  await client.db(mongoDbName).collection("Users").insertOne(userInfo);
  return client.db(mongoDbName).collection("Users").findOne({ username: userInfo.username });
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

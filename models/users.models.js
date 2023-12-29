exports.selectUsers = async (client, mongoDbName) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").find({}).toArray();
};

exports.createNewUser = async (client, mongoDbName, userInfo) => {
  await client.connect();
  const userExists = (await this.selectUserByUsername(client, mongoDbName, userInfo.username)) || null;
  if (userExists) return null;
  await client.db(mongoDbName).collection("Users").insertOne(userInfo);
  return client.db(mongoDbName).collection("Users").findOne({ username: userInfo.username });
};

exports.selectUserByUsername = async (client, mongoDbName, username) => {
  await client.connect();
  return client.db(mongoDbName).collection("Users").findOne({ username });
};

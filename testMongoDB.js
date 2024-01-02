const mongoLink = "mongodb+srv://admin:Password@cluster0.35psafi.mongodb.net/Node-API?retryWrites=true&w=majority";
const mongoDbName = "Node-API";
module.exports = { mongoLink, mongoDbName };

//first variable is uri for database
//second variable is name of the database
// These are for the test database, for a production database change this to match the group one,
// run the seed, then change these so they dont get run acidentally again. cant remember how to
// use env variables to do this for us.

// When you add the link to the group test db add this file to gitignore and make sure
// everyone has a personnal version of this file. as this is a test db on my account i havent
// git ignored it so you can trial it.

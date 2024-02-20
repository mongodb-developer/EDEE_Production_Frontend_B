var mongoClient = null;

// The first time we connect if our user doesnt exist it will be created
// When asked for a username and password make up a new one, minimum 6 characters

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
}

async function get_ServerInfo(req, res) {
  var response = await mongoClient.hello();
  res.status(200);
  res.send(response);
}

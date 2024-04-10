var mongoClient = null;

/*
* The first time we connect we can give any unique username
* and out password will be set to what we use - both must be
* at least 6 characters long.
*/

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  // Mongoclient should be creared only once

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
}

async function get_ServerInfo(req, res) {
  // hello() returns sever details to check it's up.
  
  var response = await mongoClient.hello();
  res.status(200);
  res.send(response);
}

var mongoClient = null;
var collection;

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  if (
    userName == "" ||
    userName == null ||
    passWord == "" ||
    passWord == null
  ) {
    alert("Please enter valid auth");
    return;
  }

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient.getDatabase("search").getCollection("claims");
}

// searching for Pending claims, here we're just searching in the "status" field of each document
async function get_AtlasSearch(req, res) {
  var rval = {};

  var queryTerm = req.query.get("queryTerm");

  rval.searchIndexes = await collection.listSearchIndexes();

  searchOperation = [
    { $search: { text: { query: queryTerm, path: "status" } } },
  ];
  searchResultsCursor = collection.aggregate(searchOperation);

  rval.searchResult = await searchResultsCursor.toArray();

  res.status(201);
  res.send(rval);
}

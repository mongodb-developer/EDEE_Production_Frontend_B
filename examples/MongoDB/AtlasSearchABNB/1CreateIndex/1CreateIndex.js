// Create a Search Index

var mongoClient = null;
var collection;

// ℹ️ create a Search Index - this will fail on sample_AirBNB as it's read only
// But it already exists on the data.
// but using the GET method you can have a peek at how the index is defined

async function post_AtlasSearch(req, res) {
  var rval = {};
  var requestObj = JSON.parse(req.body);

  var indexName = requestObj.index.name;
  var indexDefinition = requestObj.index.definition;

  try {
    // delete the index if exists - will fail on Read only data
    rval.drop = await collection.dropSearchIndex({ name: indexName });
  } catch (e) {
    rval.drop = e.message;
  }

  try {
    // ℹ️ create the new Search index - will fail on Read only data
    rval.index = await collection.createSearchIndex(indexName, indexDefinition);
  } catch (e) {
    rval.index = e.message;
  }

  res.status(201);
  res.send(rval);
}

// List all the indexes

async function get_AtlasSearch(req, res) {
  var rval = {};

  rval.searchIndexes = await collection.listSearchIndexes();

  res.status(201);
  res.send(rval);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}

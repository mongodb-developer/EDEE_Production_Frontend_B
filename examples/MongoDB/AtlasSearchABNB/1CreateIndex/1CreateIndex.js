// Create a Search Index

var mongoClient = null;
var collection

// ℹ️ create a Search Index: this will FAIL as the index is already pre-created for you!
// but using the GET method you can have a peek at how the index is defined

async function post_AtlasSearch(req, res) {
  var rval = {}
  
  var requestObj = JSON.parse(req.body)
  
  var indexName = requestObj.index.name
  var indexDefinition = requestObj.index.definition
  
  // delete the index if exists
  try {
    rval.drop = await collection.dropSearchIndex({name : indexName})
  } catch(e) {
    rval.drop = "Index cannot be dropped - perhaps does not exist\n" + e.toString()
  }
  
  // ℹ️ create the new Search index
  try {
    rval.index = await collection.createSearchIndex(indexName,indexDefinition)
  }
  catch(e) {
    rval.index = "Index cannot be created, possibly still being dropped " + e.toString()
  } 
  
  res.status(201);
  res.send(rval)
}

// we get the all the indexes just to check they're there!

async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")
  
  rval.searchIndexes = await collection.listSearchIndexes()
  
  res.status(201);
  res.send(rval)
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  
  if (userName == "" || userName == null || passWord == ""|| passWord == null) {
    alert("Please enter valid auth");
    return;
  }  
  
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}
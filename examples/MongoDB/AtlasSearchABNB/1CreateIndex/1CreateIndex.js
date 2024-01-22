// Create a Search Index

var mongoClient = null;
var collection

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

// create a Search Index
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

  // create the new Search index
  try {
    rval.index = await collection.createSearchIndex(indexName,indexDefinition)
  }
  catch(e) {
    rval.index = "Index cannot be created, possibly still being dropped " + e.toString()
  } 

  res.status(201);
  res.send(rval)
}

// do a simple text search to check that everything works, change the queryTerm in "Endpoint URL" 
async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

  searchOperation = [ 
    { $search : { 
      index: "default",
      text : { query: queryTerm , path:{ wildcard:  '*' } } 
    } 
    }
  ]
  searchResultsCursor = collection.aggregate(searchOperation)

  rval.searchResult = await searchResultsCursor.toArray()

  res.status(201);
  res.send(rval)
}
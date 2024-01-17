
var mongoClient = null;
var collection

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME")
  var passWord = await system.getenv("MONGO_PASSWORD", true)

  if (userName == "" || userName == null || passWord == ""|| passWord == null) {
    alert("Please enter valid auth");
    return;
  }  
  
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("search").getCollection("claims")
}

// we use range to get claims with an amount between 500 and 1000
async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

  searchOperation = [ 
    { $search : { 
      "range": {
        "path": "claim_amount",
        "gte": 500,
        "lte": 1000,
     }
    } 
    } 
  ]
  searchResultsCursor = collection.aggregate(searchOperation)

  rval.searchResult = await searchResultsCursor.toArray()


  res.status(201);
  res.send(rval)
}
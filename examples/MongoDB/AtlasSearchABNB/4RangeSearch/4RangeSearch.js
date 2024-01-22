
var mongoClient = null;
var collection

// ℹ️ we use range to get rentals for a group of 5 to 10 people

async function get_AtlasSearch(req, res) {
  var rval = {}
  
  // here we're not using the queryterm, just change the values in the range
  // var queryTerm = req.query.get("queryTerm")
    
  searchOperation = [ 
    { $search : { 
      "range": {
        "path": "accommodates",
        "gte": 5,
        "lte": 10,
      }
    } 
  } 
]
searchResultsCursor = collection.aggregate(searchOperation)

rval.searchResult = await searchResultsCursor.toArray()

res.status(201);
res.send(rval)
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME")
  var passWord = await system.getenv("MONGO_PASSWORD", true)

  if (userName == "" || userName == null || passWord == ""|| passWord == null) {
    alert("Please enter valid auth");
    return;
  }  
  
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}
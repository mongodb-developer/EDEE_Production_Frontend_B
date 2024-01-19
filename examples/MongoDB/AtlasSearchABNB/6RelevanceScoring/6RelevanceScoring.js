
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
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}

// we can compound operators in a single search
async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

  searchOperation = [ 
    { $search : { 
      "index": "default",
      "compound": {
        "must": [
          {
            "text": {
              "query": queryTerm,
              "path": "description"
            }
          }
        ],
        "should": [
          {
            "range": {
              "path": "accommodates",
              "gt": 5,
              "lt": 10
            }
          }
        ]
      }
    } 
    },
    {$project: {
      _id: 0,
      policy_number: 1,
      date_of_incident: 1,
      claim_description: 1,
      claim_amount: 1,
      status: 1,
      score: { $meta: "searchScore" }
    }}

  ]
  searchResultsCursor = collection.aggregate(searchOperation)

  rval.searchResult = await searchResultsCursor.toArray()


  res.status(201);
  res.send(rval)
}
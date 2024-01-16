
var mongoClient = null;
var collection

// Connect to MongoDB Atlas
async function initWebService() {
  let [userName, passWord] = await readUserPassword();
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("search").getCollection("claims")
}

// search in all fields, but now you can make up to two typos
// try with: "carr", "policiholder", etc.
async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

  searchOperation = [ 
    { $search : { 
      text : { 
        query: queryTerm , 
        path:{ wildcard:  '*' },
        fuzzy: {
          maxEdits: 2
        } 
      } 
    } 
    } 
  ]
  searchResultsCursor = collection.aggregate(searchOperation)

  rval.searchResult = await searchResultsCursor.toArray()


  res.status(201);
  res.send(rval)
}
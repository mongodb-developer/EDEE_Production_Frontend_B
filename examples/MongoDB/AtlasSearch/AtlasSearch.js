
var mongoClient = null;
var collection

async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")

  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("search").getCollection("metals")
}


async function post_AtlasSearch(req, res) {
  var rval = {}

  await collection.drop()
  var requestObj = JSON.parse(req.body)
  rval.insert = await collection.insertMany(requestObj.data)
  var indexName = requestObj.index.name
  var indexDefinition = requestObj.index.definition

  try {
    rval.drop = await collection.dropSearchIndex({name : indexName})
  } catch(e) {
    rval.drop = "Index cannot be dropped - perhaps does not exist\n" + e.toString()
  }

  try {
    rval.index = await collection.createSearchIndex(indexName,indexDefinition)
  }
  catch(e) {
    rval.index = "Index cannot be created, possibly still being dropped " + e.toString()
  } 

  res.status(201);
  res.send(rval)
}


async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

  searchOperation = [ { $search : { text : { query: queryTerm , path:{ wildcard:  '*' } } } } ]
  searchResultsCursor = collection.aggregate(searchOperation)

  rval.searchResult = await searchResultsCursor.toArray()


  res.status(201);
  res.send(rval)
}
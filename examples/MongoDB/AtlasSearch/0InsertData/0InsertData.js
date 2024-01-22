// Start by inserting some test data

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

// Insert some test documents: use POST
async function post_AtlasSearch(req, res) {
  var rval = {}

  await collection.drop()
  var requestObj = JSON.parse(req.body)
  rval.insert = await collection.insertMany(requestObj.data)

  res.status(201);
  res.send(rval)
}


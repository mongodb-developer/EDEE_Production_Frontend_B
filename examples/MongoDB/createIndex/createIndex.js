// This is called once when the web service starts up
var mongoClient = null;
var db,collection

async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")

  mongoClient = new MongoClient("mongodb+srv://"+userName  + ":" + passWord + "@learn.mongodb.net");
 
}
  

async function post_createIndex(req, res) {

  var rval = null;
  var requestObj = JSON.parse(req.body)
  var db = mongoClient.getDatabase("game")
  var collection = db.getCollection("highscores")
  var indexDefinition = requestObj.definition
  var name = requestObj.name
  
  rval = await collection.createIndex(name,indexDefinition)

  res.status(201);
  res.send(rval)
 }
  

// This is called once when the web service starts up
var mongoClient = null;
var db,collection

async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")

  mongoClient = new MongoClient("mongodb+srv://"+userName  + ":" + passWord + "@learn.mongodb.net");
 
  db = mongoClient.getDatabase("test")
  collection = db.getCollection("test")
}
  


async function post_Test(req, res) {

    await collection.deleteMany({})

    var documents = []
    for(x=0;x<10;x++) {
        documents.push({_id:x})
    }
    var rval = await collection.insertMany(documents)
    res.status(201);
    res.send(rval)
  }
  

async function get_Test(req, res) {
        db = mongoClient.getDatabase("test")
        rval = EJSON.stringify({a:1})
        res.status(201);
        res.send(rval)
    
}
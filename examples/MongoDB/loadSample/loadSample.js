// This is called once when the web service starts up
var mongoClient = null;
var db,collection

async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")

  mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@atlascluster.rnlzxqz.mongodb.net");
 
  db = mongoClient.getDatabase("test")
  collection = db.getCollection("sampleData")
}
  


async function post_Highscores(req, res) {


    var documents = JSON.parse(req.body)
    for( doc of documents) {    
        //Data should not be strings so convert from JSON 
        doc.timestamp = Date.parse(doc.timeStamp)
    }
    
    var rval = await collection.insertMany(documents)
    res.status(201);
    res.send(rval)
  }
  

async function get_Highscores(req, res) {
    if(req.query.get("count") == "true")
    {
        var count = await collection.countDocuments()
        res.status(201);
        res.send({nDocs:count})
    } else {
        res.status(501);
        res.send("Not implemented");
    }
}
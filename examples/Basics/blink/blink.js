
// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
    var userName = "bob"
    var passWord = "builder"
    //User created automatically if it doesn't exist in simulator
    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" 
                                  +  passWord +  "@atlascluster.rnlzxqz.mongodb.net"); 
}



//Functions names starting with get_ or post_ are exposed as HTTP endpoints
//Request and response objects are sent to each

async function get_Person(req, res) {

  var db = mongoClient.getDatabase("test")
  var collection = db.getCollection("example")

  cursor = collection.find({})
  results = []
  for await ( var doc of cursor) {
    results.push(doc)
  }
  res.status(200);
  res.send(results)
}


async function post_Person(req, res) {

  var db = mongoClient.getDatabase("test")
  var collection = db.getCollection("example")
  var object = JSON.parse(req.body)

  var rval = await collection.insertOne(object)
  res.status(201);
  res.send(rval)
}

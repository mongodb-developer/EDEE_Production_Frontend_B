
// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
  var userName = system.getenv("MONGO_USERNAME")
  var passWord = system.getenv("MONGO_PASSWORD")
  //User created automatically if it doesn't exist 
  mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net"");
}



//Functions names starting with get_ or post_ are exposed as HTTP endpoints
//Request and response objects are sent to each

async function get_Movies(req, res) {

  db = mongoClient.getDatabase("sample_mflix")
  collection = db.getCollection("movies")

    var query = {}
    query.title =  req.query.get("title")

    cursor = collection.find(query)
    results = await cursor.toArray();

    res.status(200);
    res.send(results)

}

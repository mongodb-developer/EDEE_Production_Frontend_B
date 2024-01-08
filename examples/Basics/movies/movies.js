
// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
  var userName = "bob"
  var passWord = "builder"
  //User created automatically if it doesn't exist in simulator
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@atlascluster.rnlzxqz.mongodb.net");
}



//Functions names starting with get_ or post_ are exposed as HTTP endpoints
//Request and response objects are sent to each

async function get_Movies(req, res) {

  db = mongoClient.getDatabase("sample_mflix")
  collection = db.getCollection("movies")

  try {
    var titleLookedFor = req.query.get("title")

    var query = {}
    query.title = titleLookedFor

    rval = await collection.find(query)

    res.status(200);
    res.send(rval)
  } catch (err) {
    res.status(500);
    res.send(err)
  }
}

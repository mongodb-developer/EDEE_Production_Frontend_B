// This is called once when the web service starts up
var mongoClient = null;
var listingsCollection

  
async function get_Claim(req, res) {
  
    var mongoQuery = {}
    var mongoProjection = {}


    var cursor = claimsCollection.find(mongoQuery).limit(10)
    var claims = await cursor.toArray();
    res.status(200)
    res.send(claims)
}

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    listingsCollection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews")
  }
    
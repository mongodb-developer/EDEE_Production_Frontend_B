// This is called once when the web service starts up
var mongoClient = null;
var claimsCollection

async function post_Claim(req, res) {
   
    var claim = JSON.parse(req.body)

    //Convert strings to dates or other types
    // We woudl ideally  copy fields into a new document
    // To verify the inputs.

    claim.incidentDetails.date = new Date(claim.incidentDetails.date )
    for(var interaction of claim.interactions) {
        interaction.interactionDate = new Date(interaction.interactionDate)
    }
 
    var rval = await claimsCollection.insertOne(claim)A
    res.status(201);
    res.send(rval)
  }
  
async function get_Claim(req, res) {
    query = new Document()
    if(req.query.get("id") ) {
        query._id = req.query.get("id")
        // Needs Typed
        //query._id = new ObjectId(req.query.get("id"))
    }
    console.log(query)
    var cursor = claimsCollection.find(query)
    var claims = await cursor.toArray();
    res.status(200)
    res.send(claims)
}

async function initWebService() {
    var userName = awaitt system.getenv("MONGO_USERNAME")
    var passWord = awaitt system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    claimsCollection = mongoClient.getDatabase("insurance").getCollection("claims")
    // await claimsCollection.drop() // Use if you want to restart
  }
    
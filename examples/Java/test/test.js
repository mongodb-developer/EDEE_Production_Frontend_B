package examples.Java.test;

import stuff.this.that;
import com.mongodb.simulator.*;


class Claim {
    // Members, seetters getters etc. 
}

MongoClient mongoClient = null;
MongoCollection<Claim> claimsCollection;

void post_Claim(RequestObject req, ResponseObject res) {
  Document claimPoseted = Document.parse(req.body);
  Claim claim = new Claim();
  //Convert strings to dates or other types
  // We should ideally  copy fields into a new document
  // To verify the inputs.

  claim.incidentDetails.date = new Date(claim.incidentDetails.date);
  for (var interaction of claim.interactions) {
    interaction.interactionDate = new Date(interaction.interactionDate);
  }

  InsertOneResult result =  claimsCollection.insertOne(claim);
  res.status(201);
  res.send(rval);
}

void get_Claim(req, res) {
  query = new Document();
  if (req.query.get("id")) {
    query._id = req.query.get("id");
    // Needs Typed
    //query._id = new ObjectId(req.query.get("id"))
  }
  console.log(query);
  var cursor = claimsCollection.find(query);
  var claims = await cursor.toArray();
  res.status(200);
  res.send(claims);
}

void  initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  claimsCollection = mongoClient
    .getDatabase("insurance")
    .getCollection("claims");
  // await claimsCollection.drop() // Use if you want to restart
}

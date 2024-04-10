var mongoClient = null;
var viewCollection;

async function get_PropertyViews(req, res) {
  propertyId = req.params[3];

  var query = { propertyId: propertyId };

  var data = await viewCollection.find(query).toArray();
  res.status(202);
  res.send(data);
}

// Every time this is called - add the ip of the caller to a list and
// increment the number of view by one.

async function post_PropertyViews(req, res) {
  var sourceIp = req.sourceIp; // Source of the requests (randomized in simulator)

  propertyId = req.params[3];

  //Change query as _id must be unique
  var query = { propertyId: propertyId };
  query.nViews = { $lt: 8 }; //Stop recording at 8 views

  var updateOps = {};
  updateOps["$set"] = { lastView: new Date() };
  updateOps["$inc"] = { nViews: 1 };
  updateOps["$push"] = { viewIp: sourceIp };

  // Upsert will create a new document when needed
  var options = { upsert: true };

  var rval = await viewCollection.updateOne(query, updateOps, options);

  res.status(202);
  res.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  viewCollection = mongoClient
    .getDatabase("example")
    .getCollection("advertViews");
}

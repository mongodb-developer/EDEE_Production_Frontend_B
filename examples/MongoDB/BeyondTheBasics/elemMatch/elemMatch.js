var mongoClient = null;
var arrayExample;

async function get_Data(req, res) {
  var query = {};

  // WE WANT DOCUMENTS WITH SMALL CIRCLES

  // Uncomment to try
  // query.components = { shape: "circle", size: "small" }; // Incorrect as not exact match
  // query.components  = {$elemMatch: { shape: "circle", size: "small" }} ; //Correct - look for element

  query = { "components.shape": "circle", "components.size": "large" }; // Returns circles if anything is small

  var result = await arrayExample.find(query).toArray();
  res.status(200);
  res.send(result);
}

async function post_Data(req, res) {

  nDocs = await arrayExample.countDocuments()
  if (! nDocs ) {
    docs = JSON.parse(req.body);
    rval = await arrayExample.insertMany(docs);
    res.status(201);
    res.send(rval);
  } else {
    res.status(200);
    res.send({ ok: 1, msg: "No new data loaded", docs: JSON.stringify(nDocs) });
  }
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  arrayExample = mongoClient.getDatabase("examples").getCollection("arrays");
}

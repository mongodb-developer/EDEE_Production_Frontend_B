var mongoClient = null;
var temperatureCollection;

// User POSTs to Cities to load data, GET Cities to see data.
// Then Change URL and POST to AddSummary to update all the records 
// expressively.
// Then GET Cities to see the changes.

//Generate example data
async function post_Cities(req, res) {
  await temperatureCollection.drop();
  docs = JSON.parse(req.body);
  rval = await temperatureCollection.insertMany(docs);
  res.status(201);
  res.send(rval);
}

async function get_Cities(req, res) {
  var query = {};
  var data = await temperatureCollection.find(query).toArray();
  res.status(200);
  res.send(data);
}

async function post_AddSummary(req, res) {
  query = {}; // Match everything
  summaryFields = {};
  summaryFields.mean = { $avg: "$average_temperatures" };
  summaryFields.max = { $max: "$average_temperatures" };
  summaryFields.length = { $size: "$average_temperatures" };
  expressiveUpdate = [{ $set: summaryFields }]; // An Array shows it's expressive

  rval = await temperatureCollection.updateMany(query, expressiveUpdate);
  res.status(200);
  res.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  temperatureCollection = mongoClient
    .getDatabase("examples")
    .getCollection("temperatureCollection");
  
}

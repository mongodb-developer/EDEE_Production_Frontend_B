var mongoClient = null;
var listingsCollection;

// Find out what Cheap, Medium and Expensive AirBNB means

async function get_Cohorts(req, res) {
  // Calcualte the total price for 3 nights
  var priceFor3Days = { $add: ["$cleaning_fee", { $multiply: ["$price", 3] }] };

  var output = {};
  output.totalProperties = { $count: {} };
  output.averageBeds = { $avg: "$beds" };

  output.totalWithPool = {
    $sum: { $cond: { if: { $in: ["Pool", "$amenities"] }, then: 1, else: 0 } },
  };

  var cohortDefinition = { groupBy: priceFor3Days, buckets: 3, output: output };

  var bucketAutoStage = { $bucketAuto: cohortDefinition };

  percentWithPool = {
    $set: {
      percentWithPool: {
        $multiply: [{ $divide: ["$totalWithPool", "$totalProperties"] }, 100],
      },
    },
  };

  var renameId = { $set: { price: "$_id", _id: "$$REMOVE" } };
  var pipeline = [bucketAutoStage, percentWithPool, renameId];

  var cursor = listingsCollection.aggregate(pipeline);

  var results = await cursor.toArray();

  res.status(200);
  res.send(results);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  listingsCollection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}

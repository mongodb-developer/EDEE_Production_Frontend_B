var mongoClient = null;
var collection;

// ℹ️ we use range to get rentals for a group of 5 to 10 people

async function get_AtlasSearch(req, res) {
  var rval = {};

  var path = "accommodates";

  searchOperation = {
    $search: {
      range: {
        path: path,
        gte: 5,
        lte: 10,
      },
    },
  };

  //We use aggregations $project for $search
  projection = { $project: { accommodates: 1, name: 1, "address.market": 1 } };

  searchResultsCursor = collection.aggregate([searchOperation, projection]);
  rval.searchResult = await searchResultsCursor.toArray();
  res.status(201);
  res.send(rval);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}

var mongoClient = null;
var collection;

// ℹ️ searching rentals, here we're just searching in the "summary" field of each document

async function get_AtlasSearch(req, res) {
  var rval = {};

  var queryTerm = req.query.get("queryTerm");

  var path = "summary"; // here we search just in one field

  // ℹ️ if you want to seach in all fields at the same time, use the wildcard
  // path = { wildcard : "* "}

  searchOperation = [
    {
      $search: {
        index: "default", // If default we dont explicitly need to specfy it
        text: { query: queryTerm, path: path },
      },
    },
  ];

  searchResultsCursor = collection.aggregate(searchOperation);
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

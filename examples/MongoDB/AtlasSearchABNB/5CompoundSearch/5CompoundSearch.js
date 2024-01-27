var mongoClient = null;
var collection;

// ℹ️ we can compound operators in a single search

async function get_AtlasSearch(req, res) {
  var rval = {};

  var queryTerm = req.query.get("queryTerm");

  var mustMatchQueryTerm = {
    text: {
      query: queryTerm,
      path: "description",
    },
  };

  var holds5To10 = {
    range: {
      path: "accommodates",
      gt: 5,
      lt: 10,
    },
  };

  var searchOperation = {
    $search: {
      compound: {
        must: [mustMatchQueryTerm], //All must be true
        should: [holds5To10], // Optional - but adds to score
      },
    },
  };

  searchResultsCursor = collection.aggregate([searchOperation]);
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

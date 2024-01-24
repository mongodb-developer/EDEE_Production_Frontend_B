var mongoClient = null;
var collection;

// ℹ️ we can see the relevance score of each search

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
        should: [holds5To10], // One must be true
      },
    },
  };

  //We use aggregations $project for $search

  projection = {
    $project: {
      accommodates: 1,
      description: 1,
      name: 1,
      "address.market": 1,
    },
  };

  //Add $meta to get the score
  projection.$project.score = { $meta: "searchScore" };

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

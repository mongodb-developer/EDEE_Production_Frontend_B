var mongoClient = null;
var listingsCollection

// Find which countries have the largest number of beds per room

async function get_Properties(req, res) {
    var query = { "address.country": "United States", amenities: "Pool" }
    var matchStage = { $match: query }

    var sortOrder = { price: -1 }
    var sortStage = {$sort : sortOrder  }
    // Exclude some of the larger fields
    var projectionStage = {$project : { reviews: 0, host: 0,space:0, availability: 0, description:0 }}

    var pipeline = [matchStage,sortStage, projectionStage]

    var cursor = listingsCollection.aggregate(pipeline)
    var results = await cursor.toArray();
    res.status(200)
    res.send(results)
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    listingsCollection = mongoClient
            .getDatabase("sample_airbnb")
            .getCollection("listingsAndReviews")
  }
    
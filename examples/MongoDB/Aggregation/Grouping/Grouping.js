var mongoClient = null;
var listingsCollection

// Find which countries have the largest number of beds per room

async function get_Countries(req, res) {
    groupBy = {_id : "$address.country"}
    groupBy.nProperties = { $count : {}}
    groupBy.totalBeds = { $sum: "$beds"}
    groupBy.totalRooms = { $sum: "$bedrooms"}
    groupStage = { $group : groupBy }

    // Add Ave Bedds per Room after grouping
    bedsPerRoomStage = { $set : { bedsPerRoom : {$divide: [ "$totalBeds", "$totalRooms"]}}}
    
    sortByBedsPerRoom= { $sort :  { bedsPerRoom : -1 }}
    getTop5 = { $limit: 5 }

    var pipeline = [groupStage, bedsPerRoomStage,sortByBedsPerRoom, getTop5]

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
    
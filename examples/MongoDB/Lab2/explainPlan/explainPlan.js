var mongoClient = null;
var collection, msg;

/* This collection has indexes on property_type, room_type, and beds.
   But, you can only use an index if the first field in the index is in
   the query */

async function get_IndexDemo(req, res) {

    var query = { beds: 5 };
    var projection = { _id: 1 };
    var rval = {};
    
    rval.withIndex = await collection.find(query).limit(0).explain();
    filterResponse(rval.withIndex);

    query = { bedrooms: 4 };
    rval.withoutIndex = await collection.find(query).limit(0).explain();
    filterResponse(rval.withoutIndex);

    res.send(rval);
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME");
    var passWord = await system.getenv("MONGO_PASSWORD", true);

    mongoClient = new MongoClient(
        "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
    );
    collection = mongoClient.getDatabase("sample_airbnb")
        .getCollection("largeCollection");
}

function filterResponse(r)
{
    // Remove detail for clarity
    delete r.executionStats.executionStages;
    delete r.command;
    delete r.serverParameters;
    delete r.serverInfo;
}
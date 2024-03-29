var mongoClient = null;
var collection, msg;

/* This collection has an index on  property_type,room_type,beds
   But you can only use an index if the first field in the index the query */

async function get_IndexDemo(req, res) {


    var query = { beds: 5 };
    var projection = { _id: 1 };
    var rval = {};
    
    startTime = new Date()
    rval.withIndex = await collection.find(query).limit(0).explain();
    filterResponse(rval.withIndex)
    
    endTime = new Date()
    timeTaken = (endTime - startTime);


    query = { bedrooms: 4 }
    startTime = new Date()
    rval.withoutIndex = await collection.find(query).limit(0).explain();
    filterResponse(rval.withoutIndex)
    endTime = new Date()
    timeTaken = (endTime - startTime);



    res.send(rval);
}


async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME");
    var passWord = await system.getenv("MONGO_PASSWORD", true);

    mongoClient = new MongoClient(
        "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
    );
    collection = mongoClient.getDatabase("sample_airbnb")
        .getCollection("largeCollection")

}

function filterResponse(r)
{
   
    // Remove detail for clarity
    delete r.executionStats.executionStages
    delete r.command
    delete r.serverParameters
    delete r.serverInfo
    
}
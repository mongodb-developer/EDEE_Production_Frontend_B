var mongoClient = null;
var sequenceCollection 

async function post_Sequence(req, res) {
    sequenceName = req.query.get("id")
    if(sequenceName == null || sequenceName=="" ) { sequenceName = "default" }
    
    var query = { _id : sequenceName}
    var updateOps = { $inc : { count : 1}}
    // Can add projections and sort into options too
    var options = { upsert: true, returnNewDocument: true }

    // Use findOneAndUpdate to Update and Get the before or after record
    // If you duid update() then find() you might get a race condition and
    // See it after another user has changed it again

    var rval = await sequenceCollection.findOneAndUpdate(query,updateOps,options)

    res.status(204)
    res.send(rval)
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName 
                             + ":" + passWord + "@learn.mongodb.net");
                             
    sequenceCollection = mongoClient
                        .getDatabase("test")
                        .getCollection("sequences")
}
    
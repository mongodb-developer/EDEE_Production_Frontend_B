
var mongoClient = null;
var collection;

async function post_Update(req, res) {

  //Add a document
  var insertResult = await collection.insertOne({ msg: "A doc", numUpdates: 0, modifiedBy: [], lastModifiedBy: 0 })
  var newDocId = insertResult.insertedIds[0]

  //Create 5 update Ops 
  var updateOps = []
  for( let threadId=1;threadId<6;threadId++) {
    var query = { _id :  newDocId }

    // If you uncomment this then an update will fail if the previous updater 
    // has a higher thread number
    // query.lastModifiedBy = { $lt : threadId}

    var updateOp =  { $push : { modifiedBy: threadId}, $inc: { numUpdates: 1}, $set: { lastModifiedBy: threadId }}
    updateOps.push( collection.updateOne(query,updateOp))
  }

  //Run slow ops in parallel with Promise.all
  var updateResults = await Promise.all(updateOps);
  
  finalForm = await collection.findOne({_id:newDocId});
  res.status(201);
  res.send({finalForm,updateResults});
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient.getDatabase("test").getCollection("updateExample")
  // Uncomment the line below to restart - but if there is an open
  // Transaction you will need to wait up to 30 seconds
  // await collection.drop();

}
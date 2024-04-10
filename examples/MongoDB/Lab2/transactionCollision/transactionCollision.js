
var mongoClient = null;
var collection;

async function post_txnDemo(req, res) {

  var insertResult = await collection.insertOne({ msg: "A doc", counter: 1 });
  var newDocId = insertResult.insertedIds[0];

  var query = { _id:  newDocId };
  var updateOpsTx = { $set : { wasUpdatedInTransaction : true }};
  var updateOps = { $set : { wasUpdatedOutsideTransaction : true }};
  
  var clientSession = await mongoClient.startSession();
  clientSession.startTransaction();

  // Transaction starts on first operation
  await collection.findOne(clientSession, query); 

  // Update doc outside our transaction (could be another transaction)
  updateResult1 = await collection.updateOne(query, updateOps);

  // Try to update inside (pass in the transaction session 
  // - throws Temporary Exception
  updateResult2 = await collection.updateOne(clientSession, query, updateOpsTx);

  await clientSession.commitTransaction();

  finalForm = await collection.findOne(query);
  res.status(201);
  res.send({updateResult1, updateResult2, finalForm});
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient.getDatabase("test").getCollection("txnExample")
  // Uncomment the line below to restart - but if there is an open
  // Transaction you will need to wait up to 30 seconds
  // await collection.drop();
}
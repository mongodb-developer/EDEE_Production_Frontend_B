
var mongoClient = null;
var collection;



async function post_txnDemo(req, res) {
  const rval = {};
  const x = new ObjectId();  // add a field to fetch the records by easily

  // Add a Document (updates work the same way)
  await collection.insertOne({ msg: "Added outside Transaction", x: x });
  
  clientSession = await mongoClient.startSession();
  clientSession.startTransaction();

  // Add one inside a transaction (pass in the transaction's session)
  await collection.insertOne(clientSession, 
      { msg: "Added in Transaction", x: x });

  // Add one outside after the transaction has started
  await collection.insertOne({ 
      msg: "Added outside Transaction after transaction started", x: x });

  // Query outside the transaction boundary - cannot see the one added within
  // the transaction
  var outsideTransaction = await collection.find( { x: x }, { msg: 1 })
      .toArray();
  
  // Query inside transaction boundary  - don't see the one added after start
  var insideTransaction = await collection.find(clientSession, { x: x }, 
      { msg: 1 }).toArray();

  await clientSession.commitTransaction();
  
  // After commit both are visible.
  var afterCommit =  await collection.find( { x: x }, { msg: 1 }).toArray();

  res.status(200);
  res.send({outsideTransaction,insideTransaction,afterCommit});
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient.getDatabase("test").getCollection("txnExample");
  // Uncomment the line below to restart - but if there is an open
  // Transaction you will need to wait up to 30 seconds
  // await collection.drop();
}
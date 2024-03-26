// This is called once when the web service starts up
var mongoClient = null;
var db, collection;
var _id;

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );

  db = mongoClient.getDatabase("test");
  collection = db.getCollection("test");
  _id = 1;
}

async function post_Test(req, res) {


  rval = []

  rval.push(  await collection.drop() )
  rval.push(await collection.insertOne( { _id:_id++, msg:"Outside Transaction"}))
 // rval.push(await collection.insertMany( [{ _id:_id++, msg:"Outside Transaction"},{ _id:_id++, msg:"Outside Transaction"}]))

  clientSession = await mongoClient.startSession();
  clientSession.startTransaction();
  rval.push(await collection.insertOne(clientSession,{  _id:_id++, name: "In Txn" }))

 // rval.push(await collection.insertMany(clientSession,[{  _id:_id++, name: "In Txn" },{  _id:_id++, name: "In Txn" }]))

  //Find outside transaction before commit
  rval.push(await collection.find({}).toArray())
  //Find inside the transaction before the commit
  rval.push(await collection.find(clientSession,{}).toArray())
  await clientSession.commitTransaction();
  //Find outside transaction after commit
  rval.push( await collection.find({}).toArray())
  res.status(201);
  res.send({rval});
}


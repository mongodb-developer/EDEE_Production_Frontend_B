var mongoClient = null;
var collection;
var newDocId, lockId;

async function get_EditableRecord(req, res) {

  // Simply return the record
  var docToEdit = await collection.findOne({_id:newDocId});

  // Returns null if cannot lock
  res.send({docToEdit });
}

async function post_EditableRecord(req, res) {

  var newVersion = JSON.parse(req.body);
  // Check it's locked and we have the id_
  var query = { _id: newVersion._id,  version: newVersion.version };
  var update = { $set: { content: newVersion.content }, $inc: { version: 1  } };
  updateResult = await collection.updateOne(query, update);

  var postUpdate = null;
  if (updateResult.matchedCount == 1) {
    postUpdate = await collection.findOne({ _id: newDocId });
  } else {
    postUpdate = { 
      error: `Version ${newVersion.version} had already been updated` };
  }
  res.status(201);
  res.send({ updateResult, postUpdate });
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient.getDatabase("test").getCollection("appLocks");

  //Add a document
  newDocId = "abc123";
  await collection.drop();
  try {
    await collection.insertOne({ _id: newDocId, 
      content: "A document people edit by hand", version: 1 });
  } catch (e) { /* Ignore trying to insert it again */ }
}
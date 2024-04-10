var mongoClient = null;
var collection;
var newDocId, lockId;

async function get_EditableRecord(req, res) {

  // We would issue a random lock id here so that calling POST
  // without it would fail - prevents anyone writing without holding the lock

  var checkNotLocked = { _id: newDocId, isLocked: null };
  var takeLock = { $set: { isLocked: true, lockId: lockId } };

  var docToEdit = null;

  updateResult = await collection.updateOne(checkNotLocked, takeLock, 
    { returnNewDocument: true });
  if (updateResult.matchedCount == 1) {
    docToEdit = await collection.findOne({ _id: newDocId });
  } else {
    docToEdit = { error: "Already locked by someone else" };
  }
  res.send({ updateResult, docToEdit });
}

async function post_EditableRecord(req, res) {

  var newVersion = JSON.parse(req.body);
  // Check it's locked and we have the _id
  var query = { _id: newVersion._id, isLocked: true, 
    lockId: newVersion.lockId };
  var update = { $set: { content: newVersion.content }, 
    $unset: { isLocked: true, lockId: true } };
  updateResult = await collection.updateOne(query, update);

  var postUpdate = null;
  if (updateResult.matchedCount == 1) {
    postUpdate = await collection.findOne({ _id: newDocId });
  } else {
    postUpdate = { error: "You did not have the lock for the docuement" };
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
  lockId = "12345";
  await collection.drop();
  try {
    await collection.insertOne({ 
      _id: newDocId, content: "A document people edit by hand" });
  } catch (e) { /* Ignore trying to insert it again */ }
}
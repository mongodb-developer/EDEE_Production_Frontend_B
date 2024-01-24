// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
}

async function get_Collections(req, res) {
  var db = mongoClient.getDatabase("dropMe");

  var before = await listNamespaces();

  await db.createCollection("Explicitly_created");
  var after = await listNamespaces();

  await db.drop();
  var droppedDatabase = await listNamespaces();

  res.status(200);
  res.send({ before, after, droppedDatabase });
}

async function listNamespaces() {
  nameSpaces = new Document();

  var databaseNames = await mongoClient.listDatabaseNames();
  for (var dbName of databaseNames) {
    var db = mongoClient.getDatabase(dbName);
    var collectionNames = await db.listCollectionNames();
    nameSpaces[dbName] = collectionNames.toString(); // More compact to view
  }

  return nameSpaces;
}

// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
}

async function get_Collections(req, res) {
    response = new Object()
    var databaseNames =  await mongoClient.listDatabaseNames();
    for( var dbName of databaseNames)
    {
        var db =  mongoClient.getDatabase(dbName)
        var collectionNames = await db.listCollectionNames()
        response[dbName] = collectionNames
    }

    res.status(200);
    res.send(response)
}
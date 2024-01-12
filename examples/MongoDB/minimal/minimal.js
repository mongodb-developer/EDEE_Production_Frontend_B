// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
}

async function get_ServerInfo(req, res) {
    var response =  await mongoClient.hello()
    res.status(200);
    res.send(response)
}
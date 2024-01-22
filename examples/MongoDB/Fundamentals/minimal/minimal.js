// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
}

async function get_ServerInfo(req, res) {
    var response =  await mongoClient.hello()
    res.status(200);
    res.send(response)
}
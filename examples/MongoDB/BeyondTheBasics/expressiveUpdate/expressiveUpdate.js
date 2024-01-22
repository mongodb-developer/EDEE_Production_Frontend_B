var mongoClient = null;
var machineCollection


async function get_Data(req, res) {
  
    var query = {}
    var data = await machineCollection.find(query).toArray();
    res.status(200)
    res.send(data)
}

async function post_AddSummary(req,res)
{
    query = {} ; //Everything
    summaryFields = {}
    summaryFields.mean = { $avg : "$measurements"}
    summaryFields.max = { $max : "$measurements"}
    summaryFields.length = { $size : "$measurements"}
    expressiveUpdate = [ { $set: summaryFields }] // An Array shows it's expressive

    rval = await machineCollection.updateMany(query,expressiveUpdate)
    res.status(200)
    res.send(rval)
}

//Generate example data
async function post_Data(req,res) {
    await machineCollection.drop();
    docs = JSON.parse(req.body)
    rval = await machineCollection.insertMany(docs)
    res.status(201)
    res.send(rval)
}

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    machineCollection = mongoClient
            .getDatabase("examples")
            .getCollection("machineCollection")
  }
    
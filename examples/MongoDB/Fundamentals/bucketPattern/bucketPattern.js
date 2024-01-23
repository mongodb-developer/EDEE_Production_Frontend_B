var mongoClient = null;
var viewCollection

async function get_View(req, res) {
    var data = await viewCollection.find({propertyId: "ABC123"}).toArray()
    res.status(202)
    res.send(data)
}

//Only add a view to the viewIp list if there are fewer than 8 things in the list already.
// If there are 8 - then make a new document and start adding there

async function post_View(req, res) {

    var sourceIp = req.sourceIp
    
    query = { propertyId: "ABC123" }
    query.nViews = lt(8) ; // Additional condition

    updateOps = {}
    updateOps['$set'] = { lastView: new Date()}
    updateOps['$inc'] = { nViews : 1}
    updateOps['$push'] = { viewIp : sourceIp}
    
    options = { upsert: true }
    
    var rval = await viewCollection.updateOne(query,updateOps, options)

    res.status(202)
    res.send(rval)
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    viewCollection = mongoClient.getDatabase("example").getCollection("advertViews")
    // Set up empty collection with one document
    await viewCollection.drop()
    const property = { propertyId: "ABC123", nViews: 0, viewIp : [] }
    await viewCollection.insertOne(property)
}
    
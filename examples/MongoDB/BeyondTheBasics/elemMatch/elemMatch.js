var mongoClient = null;
var arrayExample;


async function get_Data(req, res) {
  
    var query = {}

    // WE WANT DOCUMENTS WITH SMALL CIRCLES

    specification = { shape: "circle", size: "small"}

    // Uncomment to try
    // query.components = specification ; // Incorrect as not exact match
    // query.components  = {$elemMatch: specification} ; //Correct - look for element
    
    query = { "components.shape" : "circle", "components.size" : "large" } // Returns circles if anything is small

    var result = await arrayExample.find(query).toArray();
    res.status(200)
    res.send(result)
}


//Generate example data
async function post_Data(req,res) {
    await arrayExample.drop();
    docs = JSON.parse(req.body)
    rval = await arrayExample.insertMany(docs)
    res.status(201)
    res.send(rval)
}

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    arrayExample = mongoClient
            .getDatabase("examples")
            .getCollection("arrays")
  }
    
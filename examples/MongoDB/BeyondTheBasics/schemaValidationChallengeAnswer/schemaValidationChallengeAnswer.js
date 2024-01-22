var mongoClient = null;
var sales;

/* CHALLENGE: Make it so document must contain a total equal to quantity times price */
/* Not having the field, or the wrong value will fail */


//Post the data -  If it doesn't match the description it will fail.
async function post_Data(req,res) {

    doc = JSON.parse(req.body)

    //Comment out line below to see type enforced
    if(doc.date) { doc.date = new Date(doc.date) ; } // Explicity cast to Date type
    
    rval = await sales.insertOne(doc)
    res.status(201)
    res.send(rval)
}

async function get_Data(req,res)
{
    data = await sales.find({}).toArray()
    res.status(201)
    res.send(data)
}
async function initWebService() {

    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    
    db = mongoClient.getDatabase("examples")
    sales = db.getCollection("sales")

    //Create the collection and apply validation
    //Ignore failure if it already exists
    
    await sales.drop()

    properties = {}
    properties._id = { bsonType: "objectId" }
    properties.quantity = { bsonType: "int" , minimum: 1}
    properties.price = { bsonType : "double"}
    properties.total = { bsonType : "double"}
    properties.date = { bsonType : "date"}
    jsonSchema = { bsonType: "object", required: ["_id","quantity","price","date","total"],properties: properties}

    calcTotal = { $multiply : [ "$price", "$quantity"]}
    checkTotal = { $eq : [ "$total", calcTotal ]}
    validatorSpec = { $jsonSchema: jsonSchema , $expr: checkTotal }

    rval = await db.createCollection("sales", { validator: validatorSpec})


}
 
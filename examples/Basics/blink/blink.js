
// This is called once when the web service starts up
const mongoClient = null;

async function initWebService() {
    const userName = "bob"
    const passWord = "builder"
    //User created automatically if it doesn't exist in simulator
    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" +  passWord +  "@atlascluster.rnlzxqz.mongodb.net"); 
}



//Functions names starting with get_ or post_ are exposed as HTTP endpoints
//Request and response objects are sent to each

async function get_Person(req, res) {

  db = mongoClient.getDatabase("test")
  collection = db.getCollection("example")

  try {
   rval = await collection.find({})
   res.status(200);
   res.send(rval)
  } catch(err) {
    res.status(500);
    res.send(err)
  }
}


async function post_Person(req, res) {

  db = mongoClient.getDatabase("test")
  collection = db.getCollection("example")
  object = JSON.parse(req.body)
  try {
   rval = await collection.insertOne(object)
   res.status(201);
   res.send(rval)
  } catch(err) {
    res.status(500);
    res.send(err)
  }
}

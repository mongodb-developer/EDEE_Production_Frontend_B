
// This is called once when the web service starts up
var mongoClient = null;

async function initWebService() {
    var userName = system.getenv("MONGO_USERNAME")
    var passWord = system.getenv("MONGO_PASSWORD")

    mongoClient = new MongoClient("mongodb+srv://" + userName + ":" 
                                  +  passWord +  "@learn.mongodb.net"); 
}




async function post_Upsert(req, res) {

  var db = mongoClient.getDatabase("test")
  var collection = db.getCollection("upsert")

  await collection.drop()
  
  var query = { _id : 1}
  var update = { $inc : { c : 1 }}
  var options = { upsert : true }
  
  var update_1 = await collection.updateOne( query,update, options)
  var update_2 = await collection.updateOne( query,update, options)
  
  
  var find = await collection.findOne(query)
  res.status(201);
  res.send({update_1,update_2,find})
}

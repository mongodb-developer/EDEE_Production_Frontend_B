// This is called once when the web service starts up
var mongoClient = null;
var db, collection;


async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );

  db = mongoClient.getDatabase("test");
  collection = db.getCollection("test");

}

async function post_Test(req, res) {

   let _id = 1;
  rval = {}
  try {
    //If you drop a collection with an open transaction you need to wait for timeout
    //We want to leave transactions open though and we cannot know what to drop easily
    rval.drop = await collection.drop()
    rval.insertOne = await collection.insertOne({ _id: _id++, msg: "Outside Transaction" })
    
    rval.insertMany = await collection.insertMany([{ _id: _id++, msg: "Outside Transaction" }, { _id: _id++, msg: "Outside Transaction" },{ _id: _id++, msg: "Outside Transaction" }])
    //rval.deleteOne = await collection.deleteOne({_id:1});
    clientSession = await mongoClient.startSession();
    clientSession.startTransaction(); //Does not need to call server so can be not async

    rval.insertOneTX = await collection.insertOne(clientSession, { _id: _id++, name: "In Txn" })

    /* rval.insertOne = await collection.insertOne({ _id: _id++, msg: "Outside Transaction" })
    
    rval.insertManyTX = await collection.insertMany(clientSession, [{ _id: _id++, name: "In Txn" }, { _id: _id++, name: "In Txn" }])

    // Inside the transaction update a record so it's different inside and out
    rval.updateOne = await collection.updateOne({ _id: 1 }, { $set: { editOutsideTransaction: true } })
    rval.updateOneUpsert = await collection.updateOne({ _id: 40 }, { $set: { editOutsideTransaction: true } },{upsert:true})


    rval.updateOneTX = await collection.updateOne(clientSession, { _id: 2 }, { $set: { editInsideTransaction: true } })
    rval.updateManyTX = await collection.updateMany(clientSession, { _id: { $in: [4,5,99] } }, { $set: { editInsideTransaction: true } })

    rval.updateOneTXUpsert = await collection.updateOne(clientSession, { _id: 50 }, { $set: { editInsideTransaction: true } },{upsert:true})
   */
    /*
    rval.deleteOneTX  = await collection.deleteOne(clientSession,{_id:2} );
    rval.deleteManyTX = await collection.deleteMany(clientSession,{});
    */
    //     rval.findOneUpdate = await collection.findOneAndUpdate(clientSession,{_id:2},{$set:{findAndModify:true}},{returnNewDocument:true})
    rval.agg = await collection.aggregate([]).toArray()
    rval.aggTX = await collection.aggregate(clientSession,[]).toArray()
    
    //Find outside transaction before commit
    //rval.find = await collection.find({}).toArray()
    //Find inside the transaction before the commit
    //rval.findTX = await collection.find(clientSession, {}).toArray()
    rval.commitTX = await clientSession.commitTransaction(); // If we don't commit then drop hurts
    //Find outside transaction after commit
    //rval.findAfterTX = await collection.find({}).toArray()
    res.status(201);
    res.send({ rval });
  }
  catch (e) {
    let rtext = JSON.stringify(rval,null,2)
    rtext = rtext + "\nException: " + e.message
    res.send(rtext)
  }
}


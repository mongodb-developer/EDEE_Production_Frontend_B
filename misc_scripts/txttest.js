var session = db.getMongo().startSession()
var txcoll = session.getDatabase('test').getCollection('test')
var coll = db.getSiblingDB('test').getCollection('test')

coll.drop()
coll.insertOne({_id:1, tx: "outside"})

session.startTransaction()
txcoll.insertOne({_id:2,tx: "inside"}) // Real place transaction starts

coll.updateOne({ _id: 1 }, { $set: { editOutsideTransaction: true } })
txcoll.find()

txcoll.updateOne({ _id: 1 }, { $set: { editInsideTransaction: true } })

coll.find()
txcoll.find()
session.commitTransaction()
coll.find()


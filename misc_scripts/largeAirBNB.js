var out = { $out: "largeCollection" }

var addcounter = { $set : { copies : {$range: [ 0,10 ]}}}

var duplicate = { $unwind : "$copies" }
var tidy = { $unset : [ "_id","copies"]}
db.listingsAndReviews.aggregate([addcounter,duplicate,tidy,out])

db.largeCollection.createIndex({beds:1})
var db = db.getSiblingDB("sample_weatherdata");
db.data.createIndex({position:"2dsphere"})

//Create an Atlas Search index on listingsAndReviews
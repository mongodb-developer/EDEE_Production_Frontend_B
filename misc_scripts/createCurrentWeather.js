db = db.getSiblingDB("sample_airbnb");

var groupByMarket = {
  $group: {
    _id: "$address.market",
    location: { $first: "$address.location.coordinates" },
  },
};
var outToWeather = { $out: { db: "sample_weatherdata", coll: "locations" } };
db.listingsAndReviews.aggregate([groupByMarket, outToWeather]);

var lookupPipeline = [
  {
    $geoNear: {
      near: { type: "Point", coordinates: "$$pt" },
      distanceField: "distance",
      query: { "airTemperature.quality": "1" },
    },
  },
  { $limit: 1 },
];


// db.listingsAndReviews.aggregate([groupByMarket])
var db = db.getSiblingDB("sample_weatherdata");
db.data.createIndex({position:"2dsphere"})
db
var lookupWeather = {
  $lookup: {
    from: "data",
    as: "weather",
    let: { pt: "$location" },
    pipeline: lookupPipeline,
  },
};
var pullUp = {
  $replaceRoot: {
    newRoot: { $mergeObjects: [{ $first: "$weather" }, "$$ROOT"] },
  },
};
var changeDate = { $set: { ts: new Date(), weather: "$$REMOVE" } };
var writeBack = { $out: { db: "sample_airbnb", coll: "latestWeather" } };
db.locations.aggregate([lookupWeather, pullUp, changeDate, writeBack]);
var db = db.getSiblingDB("sample_airbnb");

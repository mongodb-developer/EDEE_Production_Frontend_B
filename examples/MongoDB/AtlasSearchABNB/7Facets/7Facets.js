
var mongoClient = null;
var collection

// to do Facet search we need a new index that supports facets:
// Here is that pre-created index JSON definition:

// {
//   "mappings": {
//     "dynamic": true,
//     "fields": {
//       "address": {
//         "fields": {
//           "country": {  "type": "stringFacet" }
//         },
//         "type": "document"
//       },
//       "property_type": {
//         "type": "stringFacet"
//       }
//     }
//   }
// }

//Change to show countries

async function get_AtlasSearch(req, res) {
  var rval = {}

  searchOperation = [
    {
      $searchMeta: {
        index: "airbnbFacetIndex",
        "facet": {
          "facets": {
            "typeFacet": {
              "type": "string",
              "path": "property_type",
            }
          }
        }
      }
    }
  ]

  searchResultsCursor = collection.aggregate(searchOperation)
  rval.searchResult = await searchResultsCursor.toArray()
  res.status(201);
  res.send(rval)
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME")
  var passWord = await system.getenv("MONGO_PASSWORD", true)

  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}

var mongoClient = null;
var collection

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME")
  var passWord = await system.getenv("MONGO_PASSWORD", true)

  if (userName == "" || userName == null || passWord == ""|| passWord == null) {
    alert("Please enter valid auth");
    return;
  }  
  
  mongoClient = new MongoClient("mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  collection = mongoClient.getDatabase("sample_airbnb").getCollection("listingsAndReviews");
}

// to do Facet search we need a new index that supports facets:
// Here is that pre-created index JSON definition:

// {
//   "mappings": {
//     "dynamic": true,
//     "fields": {
//       "address": {
//         "fields": {
//           "country": {
//             "type": "stringFacet"
//           }
//         },
//         "type": "document"
//       },
//       "property_type": {
//         "type": "stringFacet"
//       }
//     }
//   }
// }
async function get_AtlasSearch(req, res) {
  var rval = {}
  
  var queryTerm = req.query.get("queryTerm")

  rval.searchIndexes = await collection.listSearchIndexes()

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
var mongoClient = null;
var listingsCollection


async function get_Query(req, res) {
  
    var query = {}
    var projection  = {}

    // Cheapest price for 4 guests including cleaning fees

    totalPrice  = { $add : [ "$price", "$cleaning_fee"] }
    query.$expr = { $lt : [ totalPrice, 100 ]}
    query.guests_included = { $gte : 4 } ; //Allowed befor extra charges

    projection  = { name: 1, 'address.country':1, 'address.market' :1,
    beds:1, accomodates: 1, price:1, cleaning_fee: 1, guests_included: 1}
    
    projection.totalPrice = totalPrice



    var cursor = listingsCollection.find(query, projection).limit(10)

    var properties = await cursor.toArray();
    res.status(200)
    res.send(properties)
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    listingsCollection = mongoClient
            .getDatabase("sample_airbnb")
            .getCollection("listingsAndReviews")
  }
    
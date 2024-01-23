var mongoClient = null;
var listingsCollection

// Create a dashboard showing each country with the top 3 markets (towns)
// in that country ordered by number of properties
// For each market show the number of beds and the average basic price per bed
// Order the countries by the number of beds in those top three markets

async function get_Dashboard(req, res) {

    // Group by country and market
    var groupByCountryAndMarket = {}

    var pricePerBed =  { }
  
    // Group by country taking topN

    var groupByCountry = { }

    // Add a sum to sort by

    var addSumOfBeds = { }

    // Sort by totalBeds
    var sortByTotalBeds = {}

    //Remove extra 

    var tidyUp = {}

    var pipeline = [groupByCountryAndMarket,pricePerBed,groupByCountry, addSumOfBeds,  sortByTotalBeds, tidyUp]

    var cursor = listingsCollection.aggregate(pipeline)
    var results = await cursor.toArray();
    res.status(200)
    res.send(results)
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME")
    var passWord = await system.getenv("MONGO_PASSWORD",true)
    mongoClient = new MongoClient("mongodb+srv://" + userName  + ":" + passWord + "@learn.mongodb.net");
    listingsCollection = mongoClient
            .getDatabase("sample_airbnb")
            .getCollection("listingsAndReviews")
  }
    
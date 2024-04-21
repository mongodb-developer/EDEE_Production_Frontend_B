// This is called once when the web service starts up
var mongoClient = null;
var bookingsCollection;

  // In a full solution take this input and use it to populate
  // a Booking object rather than just trust it like this.

async function post_Booking(req, res) {
  var booking = JSON.parse(req.body);

  // Comment out line below to use an ObjectID
  booking._id = booking.bookingId; // in MongoDB put the PK in _id
  
  // Convert strings to dates or other required types
  booking.bookingDates.checkIn = new Date(booking.bookingDates.checkIn);
  booking.bookingDates.checkOut = new Date(booking.bookingDates.checkOut);

  var rval = await bookingsCollection.insertOne(booking);
  res.status(201);
  res.send(rval);
}

async function get_Booking(req, res) {
  var query = {}; 
  if (req.query.get("id")) {
    query._id = req.query.get("id");
    // Uncomment if using ObjectId
    // query._id = new ObjectId(req.query.get("id"))
  }
  console.log(query);
  var cursor = bookingsCollection.find(query);
  var bookings = await cursor.toArray(); 
  res.status(200);
  res.send(bookings);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  bookingsCollection = mongoClient
    .getDatabase("ayrbnb")
    .getCollection("bookings");
  // await bookingsCollection.drop() // Use if you want to reset
}

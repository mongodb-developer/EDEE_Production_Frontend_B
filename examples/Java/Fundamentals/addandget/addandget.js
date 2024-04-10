// In Java these would be specific types, or var from JDK10 onwards

var mongoClient = null;
var claimsCollection;

// This is the Dynamic / Document style of using MongoDB using the
// Document() class - versus POJO seen later.

async function post_Claim(req, res) {
  // The Document (HashMap<String,Object>) class includes an
  // EJSON parser in the static parse() function that returns a Document

  var claim = Document.parse(req.body);

  // Convert strings to dates or other types.
  // We should ideally all copy fields into a new document
  // To verify the inputs.

  // With Document we can change the type of a field
  var details = claim.get("incidentDetails", Document.class);

  details.put("date", new Date(details.getString("date")));

  var interactions = claim.getList("interactions", Document.class);
  // of rather than : in for using JS
  for (var interaction of interactions) {

    interaction.put(
      "interactionDate",
      new Date(interaction.getString("interactionDate"))
    );
  }

  var rval = await claimsCollection.insertOne(claim);
  res.status(201);
  res.send(rval);
}

async function get_Claim(req, res) {
  var query = Filters.empty();
  if (req.query.get("id")) {
    query = Filters.eq("_id", req.query.get("id"));
    // Needs Typed to ObjectID to work
    // query = Filters.eq("_id", new ObjectId(req.query.get("id")))
    
  }

  var iterable = claimsCollection.find(query);
  var claims = new ArrayList();
  await iterable.into(claims);

  res.status(200);
  res.send(claims);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  claimsCollection = mongoClient
    .getDatabase("insurance")
    .getCollection("claims");
  // await claimsCollection.drop() // Use if you want to restart
}

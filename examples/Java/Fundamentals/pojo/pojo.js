// In Java these would be specific types, or var from JDK10 onwards

var mongoClient = null;
var claimsCollection;

// Using public members just to keep it small - In java these have Types
class Claimant {
  user;
  contact;
  email;
}

class Claim {
   claimNumber;
   policyNumber;
   claimant
}

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
  if (req.query.get("id")) {
    query = eq("_id", req.query.get("id"));
    /*  Needs Typed to ObjectID to work
     * query._id = new ObjectId(req.query.get("id"))
     */
  }

  var iterable = claimsCollection.find(query);
  var results = new ArrayList();
  await iterable.into(results);
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

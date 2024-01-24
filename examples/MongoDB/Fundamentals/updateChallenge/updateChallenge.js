var mongoClient = null;
var taskCollection;
const STATUS_NEW = "1 - New",
  STATUS_ASSIGNED = "2 - Assigned",
  STATUS_DONE = "3 - Complete";

// This service is a Task  queue
// You can add a new Task with post_Task and list them  with get_Task
// You need to add post_Assign?user=Name - which will find any task that is not assigned and
// Assign it to that user, changing the status to STATUS_ASSIGNED.
// A task can be (re)assigned if it is NEW or has been Assigned for more than 1 minute (Abandoned)

async function post_Assign(req, res) {
  (assignedTo = req.query.get("user")), (assignedTask = null);
  if (!assignedTo) {
    res.status(400);
    res.send({ error: "No user specified" });
    return;
  }
  oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

  // Answer here you may need { $or : [ {query1}, {query2} ]}

  // findOneAndUpdate returns the document after updating
  options = { returnNewDocument: true };
  assignedTask = await taskCollection.findOneAndUpdate(
    assignableTasks,
    assignTask,
    options
  );
  res.status(202);
  res.send({ task: assignedTask });
}

async function get_Task(req, res) {
  query = {};
  var data = await taskCollection.find(query).sort({ status: 1 }).toArray();
  res.status(202);
  res.send({ tasks: data });
}

//Only add a view to the viewIp list if there are fewer than 8 things in the list already.

async function post_Task(req, res) {
  const description =
    "This doesn't matter in this exercise but you would send it to the API";
  newTask = {
    date: new Date(),
    status: STATUS_NEW,
    assignedTo: null,
    dateAssigned: null,
    description,
  };

  rval = await taskCollection.insertOne(newTask);
  res.status(202);
  res.send({ taskId: rval?.result?.insertedIds?.[0] });
}

async function post_Complete(req, res) {
  taskId = req.params[3];
  if (!taskId) {
    res.status(400);
    res.send({ error: "No task specified" });
    return;
  }
  completeTask = { $set: { status: STATUS_DONE } };
  query = { _id: new ObjectId(taskId) };
  rval = await taskCollection.updateOne(query, completeTask);
  res.status(202);
  res.send({ rval });
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  taskCollection = mongoClient.getDatabase("example").getCollection("tasks");
  //  await taskCollection.drop(); // Uncomment to reset the colleciton
}

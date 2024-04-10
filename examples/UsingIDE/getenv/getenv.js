var some_value = 0;

// Functions that interact with asynchronous UI or Database operations need to
// be declared as async and called with await

// getenv("name") retrieves an environment variable. The first time
// you do so it will ask you to enter a value for it.
// clearenv("name") deletes it.

async function initWebService() {
  // system.clearenv("SOME_VAR");
  some_value = await system.getenv("SOME_VAR");
}

function get_Value(req, res) {
  res.status(200);
  res.send({ count: some_value });
}

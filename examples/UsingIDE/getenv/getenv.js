var some_value = 0;

// fuctions that interact with UI or Database need to be
// declared as async , calls as await

// getenv(X) will request a value for X the first time

async function initWebService() {
  await system.clearenv("SOME_VAR");
  some_value = await system.getenv("SOME_VAR");
}

function get_Value(req, res) {
  res.status(200);
  res.send({ count: some_value });
}

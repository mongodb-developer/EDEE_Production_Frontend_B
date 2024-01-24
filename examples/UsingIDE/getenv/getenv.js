var some_value = 0;

async function initWebService() {
  await system.clearenv("SOME_VAR");
  some_value = await system.getenv("SOME_VAR");
}

function get_Value(req, res) {
  res.status(200);
  res.send({ count: some_value });
}

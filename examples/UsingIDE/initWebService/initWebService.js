var counter = 0;

// This is only called once (until you modify any code)
// Use it as a setup function

async function initWebService() {
  counter = 1000;
}

function get_Count(req, res) {
  res.status(204);
  counter++;
  res.send({ count: counter });
}

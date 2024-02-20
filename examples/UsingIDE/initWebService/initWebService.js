var counter = 0;

async function initWebService() {
  counter = 5;
}

// Technically PUT not GET as GET may cache
function get_Count(req, res) {
  res.status(204);
  counter = counter + 1;
  res.send({ count: counter });
}

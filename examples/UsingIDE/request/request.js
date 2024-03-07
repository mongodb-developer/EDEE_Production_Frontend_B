
// POST endpoint is passed the post data in body

function post_Echo(req, res) {
  // Request body (POST DATA) is a string.
  var bodyString = req.body;
  // JSON, EJSON  or Document classes can parse JSON data to object
  var bodyObj = JSON.parse(bodyString);
  res.status(200);
  res.send({ echo: bodyObj });
}

function get_Echo(req, res) {

  //req.query contains values from the URL

  var value = req.query.get("value");
  res.status(200);
  res.send({ echo: value });
}

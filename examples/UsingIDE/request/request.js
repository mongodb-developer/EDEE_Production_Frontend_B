// get_XXXX or post_XXXX define Get and Post endpoints

function post_Echo(req, res) {
  //Default Content-Type is application/json

  var bodyString = req.body;
  var bodyObj = JSON.parse(bodyString);

  res.status(200);
  res.send({ echo: bodyObj });
}

function get_Echo(req, res) {
  //Default Content-Type is application/json

  var value = req.query.get("value");

  res.status(200);
  res.send({ echo: value });
}

// get_XXXX or post_XXXX define Get and Post endpoints

function get_Hello(req, res) {
  //Default Content-Type is application/json

  res.status(200);
  res.send({ msg: "Hello" });
}

// Simple serverless functions
// get_XXXX or post_XXXX define Get and Post endpoints

function get_Hello(req, res) {
  //HTTP Status code
  res.status(200);
  //Send takes a String or an Object
  res.send({ msg: "Hello" });
}

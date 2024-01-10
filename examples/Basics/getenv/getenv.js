var some_value = 0;


function initWebService() {
    some_value = system.getenv("SOME_VAR")
}

function get_Value(req, res) {
    res.status(200);
    res.send({ count : some_value})
}
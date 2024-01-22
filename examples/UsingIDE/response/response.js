function get_Hello(req, res) {
    
    //Default Content-Type is application/json

    res.status(200);
    res.send({ msg : "Hello"})
}
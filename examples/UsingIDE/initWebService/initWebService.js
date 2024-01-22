var counter = 0;


function initWebService() {
    counter = 5;
}

function get_Count(req, res) {
    
    // We shouldn't really use GET if we are changing something
    
    res.status(204);
    counter=counter+1;
    res.send({ count : counter})
}
var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send("API is working properly");
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/testAPI in the browser to see the response
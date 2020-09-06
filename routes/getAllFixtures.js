var express = require("express");
var router = express.Router();
let data = require("../data/predictions.json");

router.get("/", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/getAllFixtures in the browser to see the response
var express = require("express");
var router = express.Router();
//const fs = require('fs');
//var data = require("../data/predictions.json");
var fixtureArray = require("../data/predictions.json");

updateGameweek();

router.get("/", function(req, res) { //need to accept gameWeek and fixtureId as args
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    res.json(fixtureArray);
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/updateGameweek in the browser to see the response

function updateGameweek() { //need to accept gameWeek and fixtureId as args
    
    console.log(fixtureArray);

    let gameWeekID = 30; //pass gameWeek as args
    let fixtureToMoveIndex = fixtureArray[0].rounds[0].matches.findIndex(e => e.fixtureId === "EVELIV28373"); //pass fixtureId as args

    console.log("Index of fixture to be moved:");
    console.log(fixtureToMoveIndex);

    let fixture = fixtureArray[0].rounds[0].matches[fixtureToMoveIndex]

    fixtureArray[0].rounds[0].matches.splice(fixtureToMoveIndex, 1);
    console.log("Fixture:");
    console.log(fixture);

    //need to write to file that fixture has been removed
    //file.key = "new value";

    /*fs.writeFile(fixtureArray, JSON.stringify(fixtureArray), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(fixtureArray));
    console.log('writing to ' + fixtureArray);
    });*/

    let gameWeekIndex = fixtureArray[0].rounds.findIndex(e => e.gw === gameWeekID);
    console.log("GW index:");
    console.log(gameWeekIndex);

    fixtureArray[0].rounds[gameWeekIndex].matches.push(fixture);
    console.log("GW index 2:");
    console.log(fixtureArray[0].rounds[gameWeekIndex]);

    //need to write to file that fixture has been added back in at new gw index
    
    console.log("Array:");
    console.log(fixtureArray);
}
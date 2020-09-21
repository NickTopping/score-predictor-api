var express = require("express");
var router = express.Router();
const fs = require('fs');
const fileName = "C:/Users/nick_/Documents/Dev/score-predictor-api/data/predictions.json";
let fixtureArray = require("../data/predictions.json");

router.get("/:newGW/:fixtureId", function(req, res) { //need to accept gameWeek and fixtureId as args

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');

    updateGameweek(req.params["newGW"], req.params["fixtureId"]);
 
    res.json(fixtureArray);
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/updateGameweek in the browser to see the response

function updateGameweek(newGW, fixtureId) { //need to accept gameWeek and fixtureId as args
    console.log("newGW: " + newGW);
    console.log(fixtureArray);

    let gameWeekID = parseInt(newGW); //pass gameWeek as args
    let fixtureToMoveIndex = fixtureArray[0].rounds[0].matches.findIndex(e => e.fixtureId === fixtureId); //pass fixtureId as args

    console.log("Index of fixture to be moved:");
    console.log(fixtureToMoveIndex);

    let fixture = fixtureArray[0].rounds[0].matches[fixtureToMoveIndex]

    fixtureArray[0].rounds[0].matches.splice(fixtureToMoveIndex, 1);
    console.log("Fixture:");
    console.log(fixture); 
   
    let gameWeekIndex = fixtureArray[0].rounds.findIndex(e => e.gw === gameWeekID);
    console.log("GW index:");
    console.log(gameWeekIndex);

    fixtureArray[0].rounds[gameWeekIndex].matches.push(fixture);
    console.log("GW index 2:");
    console.log(fixtureArray[0].rounds[gameWeekIndex]);

    fs.writeFile(fileName, JSON.stringify(fixtureArray, null, 2), function(err) {
        if (err) {
            return console.log(err);
        } 
        console.log("file saved to " + fileName);
    });

    console.log("Save to file that removes and re-adds fixture complete");
    
    console.log("Array:");
    console.log(fixtureArray);
}
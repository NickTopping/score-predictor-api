var express = require("express");
var router = express.Router();
const fs = require('fs');
const fileName = "C:/Users/nick_/Documents/Dev/score-predictor-api/data/predictions.json";
let fixtureArray = require("../data/predictions.json");

router.get("/:newGW/:fixtureId", function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');

    updateGameweek(req.params["newGW"], req.params["fixtureId"]);
 
    res.json(fixtureArray);
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/updateGameweek in the browser to see the response

function updateGameweek(newGW, fixtureId) {

    let gameWeekID = parseInt(newGW);    
    let allRounds = fixtureArray[0].rounds;
    let fixtureToMoveIndex;
    let fixture;

    for (var i = 0; i < allRounds.length; i++) {

        fixtureToMoveIndex = allRounds[i].matches.findIndex(e => e.fixtureId === fixtureId);
        console.log(fixtureToMoveIndex);
        
        if (fixtureToMoveIndex > -1) {
            
            fixture = fixtureArray[0].rounds[i].matches[fixtureToMoveIndex]

            fixtureArray[0].rounds[i].matches.splice(fixtureToMoveIndex, 1);
            console.log("Fixture: " + fixture);           
            break;
        }
    }
   
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
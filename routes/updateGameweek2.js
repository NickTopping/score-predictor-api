const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileName = "C:/Users/nick_/Documents/Dev/score-predictor-api/data/predictions.json";
let data = require("../data/predictions.json");

router.put('/', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');

    let allRounds = data[0].rounds;
    let updatedCount = 0;
    var reqChanges = Object.keys(req.body.gwUpdates).length;

    //for each fixture in request body
    req.body.gwUpdates.forEach(function (item) {       

        for (var i = 0; i < allRounds.length; i++) {

            let fixtureToMoveIndex = allRounds[i].matches.findIndex(e => e.fixtureId === item.fixtureId);
            let targetGameWeekIndex = data[0].rounds.findIndex(e => e.gw === parseInt(item.gw));
            
            if (fixtureToMoveIndex > -1 && targetGameWeekIndex > -1) {
                
                //cut from existing gw
                let fixture = data[0].rounds[i].matches[fixtureToMoveIndex]
                data[0].rounds[i].matches.splice(fixtureToMoveIndex, 1);    
                
                //paste into new gw               
                data[0].rounds[targetGameWeekIndex].matches.push(fixture);
               
                updatedCount++;
                break;
            }
        }
    });    
    
    //check if any update requests failed
    if (updatedCount === reqChanges) {
        
        fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
            if (err) {
                return console.log(err);
            } 
            console.log("file saved to " + fileName);
        });

        res.sendStatus(204); 
    } 
    else {
        res.sendStatus(400);
    }
    
});

module.exports = router;
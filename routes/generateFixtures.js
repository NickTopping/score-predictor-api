const express = require("express");
const router = express.Router();
let allTeams = require("../data/teams.json");
const fs = require('fs');
const filePath = "data/output.json";

router.get("/", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

module.exports = router;

//If prediction.json already exists, send message as response, otherwise create file in correct location
if (fs.existsSync(filePath)) {
    response = "File already exists";
    return;
}

response = generateFixtures(allTeams);

//Include flag in array to say fixture has been confirmed or score confirmed?
function generateFixtures(teamList) {

    var arr = []; 
    var rounds = [];
    var matches = [];    

    for (var firstTeam = 0; firstTeam < teamList["teams"].length; firstTeam++) {
        for (var secondTeam = firstTeam + 1; secondTeam < teamList["teams"].length; secondTeam++) {
            
            var homeTeamName = teamList["teams"][firstTeam].teamName;
            var awayTeamName = teamList["teams"][secondTeam].teamName;
            var fixtureId =  homeTeamName.substring(0,3).toUpperCase() + awayTeamName.substring(0,3).toUpperCase() + Math.floor(10000 + Math.random() * 90000);

            matches.push( 
                {
                fixtureId: fixtureId,
                date:"2000-01-01",
                homeTeamId: teamList["teams"][firstTeam].teamId,
                homeTeamName: homeTeamName,
                awayTeamId: teamList["teams"][secondTeam].teamId,
                awayTeamName: awayTeamName,
                homeGoals: 0, 
                awayGoals: 0,        
                });
        }
    }
    
    for (var firstTeam = 0; firstTeam < teamList["teams"].length; firstTeam++) {
        for (var secondTeam = firstTeam + 1; secondTeam < teamList["teams"].length; secondTeam++) {
            
            var homeTeamName = teamList["teams"][secondTeam].teamName;
            var awayTeamName = teamList["teams"][firstTeam].teamName;
            var fixtureId =  homeTeamName.substring(0,3).toUpperCase() + awayTeamName.substring(0,3).toUpperCase() + Math.floor(10000 + Math.random() * 90000);

            matches.push( 
                {
                fixtureId: fixtureId,
                date:"2000-01-01",
                homeTeamId: teamList["teams"][secondTeam].teamId,
                homeTeamName: teamList["teams"][secondTeam].teamName,
                awayTeamId: teamList["teams"][firstTeam].teamId,
                awayTeamName: teamList["teams"][firstTeam].teamName,
                homeGoals: 0, 
                awayGoals: 0,         
                });
        }
    }    

    for (var i = 0; i < 39; i++) {
        if (i === 0 ){
            rounds.push({
                gw: i,
                matches: matches 
            });
        }
        else{
            rounds.push({
                gw: i,
                matches: []
            });
        }   
    };

    arr.push({
        "name": "Premier League 2019/20",
        "rounds": rounds   
    });  

    //return arr; 

    //Comment line above and uncomment below to generate fixtures file "output.json""
    var jsonContent = JSON.stringify(arr);

    fs.writeFile(filePath, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    
        console.log("JSON file has been saved.");
    });
}



//POST to generate fixtures

//PATCH/PUT to update fixtures

//GET to retrieve fixtures by GW/TEAM
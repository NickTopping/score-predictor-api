var express = require("express");
var router = express.Router();
let data = require("../data/predictions.json");

var rounds = data[0].rounds;
var response = hydrateDT();

router.get("/", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

module.exports = router;

//run npm start to start server
//search for http://localhost:9000/getLeagueTable in the browser to see the response

function hydrateDT() {

    var dataTable = [];
  
    for (var gameWeek in rounds) {

      //Only use matches that have a prediction/valid fixture date against them
      if (gameWeek == 0) {
        continue;
      }

      var fixtures = rounds[gameWeek].matches;
  
      for (var match in fixtures) {
        var matchdayTeams = [
          {
            homeOrAway: "H",
            teamId: fixtures[match].homeTeamId,
            teamName: fixtures[match].homeTeamName,
            homeGoals: fixtures[match].homeGoals,
            awayGoals: fixtures[match].awayGoals
          },
          {
            homeOrAway: "A",
            teamId: fixtures[match].awayTeamId,
            teamName: fixtures[match].awayTeamName,
            homeGoals: fixtures[match].homeGoals,
            awayGoals: fixtures[match].awayGoals
          }
        ];
  
        for (var team in matchdayTeams) {
  
          var homeOrAway = matchdayTeams[team].homeOrAway;
          var teamId = matchdayTeams[team].teamId;
          var teamName = matchdayTeams[team].teamName;
          var win = 0;
          var draw = 0;
          var loss = 0;
          var homeGoals = parseInt(matchdayTeams[team].homeGoals);
          var awayGoals = parseInt(matchdayTeams[team].awayGoals);
          var goalDifference = 0;
          var totalPoints = 0;
  
          switch (true) {
            case homeGoals > awayGoals && homeOrAway === "H":
              win = 1
              break
            case homeGoals < awayGoals && homeOrAway === "H":
              loss = 1
              break
            case homeGoals < awayGoals && homeOrAway === "A":
              win = 1
              break
            case homeGoals > awayGoals && homeOrAway === "A":
              loss = 1
              break
            default:
              draw = 1
          }
  
          //Further validation here
          if (teamId === "undefined") {
            console.log("Error, unrecognised TeamId")
            return;
          }
  
          //If team already exists
          if (dataTable.some(el => el.teamId === teamId)) {         
            updateTable(dataTable, homeOrAway, teamId, win, draw, loss, homeGoals, awayGoals)
          }
          //If team is a new entry
          else {
            totalPoints = win * 3 + draw;
            var gf = 0;
            var ga = 0;
  
            if (homeOrAway === "H") {
              gf = homeGoals;
              ga = awayGoals;
              goalDifference = homeGoals - awayGoals;
            } 
            else {
              gf = awayGoals;
              ga = homeGoals;
              goalDifference = awayGoals - homeGoals;
            }
  
            dataTable.push({
              teamId: teamId,
              teamName: teamName,
              played: 1,
              wins: win,
              draws: draw,
              losses: loss,
              goalsFor: gf,
              goalsAgainst: ga,
              goalDifference: goalDifference,
              points: totalPoints
            });
          }
        }
      }
    }

    dataTable.sort(
      function(a, b) {          
         if (a.points === b.points) {
            if (a.goalDifference === b.goalDifference){
              //gf is only important whe gd is the same
              return b.gf - a.gf;
            }
            //gd is only important when points are the same
            return b.goalDifference - a.goalDifference;
         }
         return b.points - a.points;
      });
    
    return dataTable
  }
  
  function getTeamData(team) {
    return {
      totalPlayed: team.wins + team.draws + team.losses,
      totalWins: team.wins,
      totalDraws: team.draws,
      totalLosses: team.losses,
      totalGF: team.goalsFor,
      totalGA: team.goalsAgainst,
      totalGD: team.goalDifference,
      totalPoints: team.points,
    }
  }
  
  function updateTable(dataTable, homeOrAway, teamId, win, draw, loss, homeGoals, awayGoals) {
    
    var goalDifference = 0;
    var totalPoints = 0;
    var gf = 0;
    var ga = 0;
  
    if (homeOrAway === "H") {
      gf = homeGoals
      ga = awayGoals
      goalDifference = homeGoals - awayGoals
    } 
    else {
      gf = awayGoals
      ga = homeGoals
      goalDifference = awayGoals - homeGoals
    }
  
    totalPoints = win * 3 + draw;
  
    //Find team in dataTable
    var teamIndex = dataTable.findIndex(element => element.teamId === teamId)
  
    //Get data for existing team
    var currentTeam = getTeamData(dataTable[teamIndex])
    Object.assign(
      dataTable[teamIndex],
      { played: 1 + currentTeam.totalPlayed },
      { wins: win + currentTeam.totalWins },
      { draws: draw + currentTeam.totalDraws },
      { losses: loss + currentTeam.totalLosses },
      { goalsFor: gf + currentTeam.totalGF },
      { goalsAgainst: ga + currentTeam.totalGA },
      { goalDifference: goalDifference + currentTeam.totalGD },
      { points: totalPoints + currentTeam.totalPoints }
    )
  }
//Requires - Node
var express = require('express');
var router = express.Router();
var pool = require('../connectionPool');

//Requires - Local
const helpers = require('../helpers');

router.route('/')
  .get(getTournaments)
  .post(createTournament)

router.route('/:tournamentId')
  .get(getTournament)
  .delete(deleteTournament)

router.route('/:tournamentId/:userId')
  .post(addUserToTournament)
  .delete(removeUserFromTournament)

//-----------------------------------------

function getTournaments(req, res){
  pool.query('SELECT * FROM tournaments ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
}

function createTournament(req, res){
  //If a user is logged in...
  if(helpers.checkIfLoggedIn(req)){
    //If the request gave a name for the tournament...
    if(req.body.name){
      //Make a new tournament.
      pool.query('INSERT INTO tournaments (name) VALUES ($1) RETURNING id', 
          [req.body.name], (error, results) => {
          if (error) {
            res.status(400).send(error);
          }
          else{
            //Add the user as an admin.
            //console.log(req.session.userid);
            //console.log(results.rows[0].id);
            pool.query('INSERT INTO participants (user_id, tournament_id, is_admin) VALUES ($1, $2, true)', 
            [req.session.userid, results.rows[0].id], (error, results) => {
              if(error) {
                res.status(400).send(error);
              }
              else{
                //res.status(200).json(results.rows); //empty?
                res.status(200).send("Succesfully added tournament and assigned logged-in user as admin")
              }
            });
          }
        });
    }
    else{
      res.status(400).send("No tournament name given");
    }
  }
  else{
    res.status(400).send("Not logged in");
  }
}

function getTournament(req, res){
  helpers.getTournamentData(req.params.tournamentId, (error, results) => {
    if(error){
      res.status(400).send(error);
    }
    else if (!results.rows){
      res.status(400).send("No tournament with provided ID found.")
    }
    else{
      res.status(200).send(results.rows[0]);
    }
  });
}

function addUserToTournament(req, res){

}

function removeUserFromTournament(req, res){

}

function deleteTournament(req, res){
  //If a user is logged in...
  if(helpers.checkIfLoggedIn(req)){
    //If the user is an admin of the tournament...
    helpers.getParticipantData(req.session.userid, req.params.tournamentId, (error, results) => {
      if(error){
        res.status(400).send(error);
      }
      else if(!results.rows.length){
        res.status(400).send("Coud not delete tournament - does it exist? Are you an admin of it?")
      }
      else{
        pool.query('DELETE FROM tournaments WHERE id = $1', [req.params.tournamentId], (error, results) => {
          if (error) {
            res.status(400).send(error);
          }
          else{
            res.status(200).send("Successfully deleted tournament.")
          }
        });
      }
    });
  }
}

module.exports = router;
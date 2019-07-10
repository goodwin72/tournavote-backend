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
  .put(updateTournament)
  .delete(deleteTournament)

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
  if(helpers.checkIfLoggedIn(req)){
    //If the request gave a name for the tournament...
    if(req.body.name){
      pool.query('INSERT INTO tournaments (name) VALUES ($1)', 
          [req.body.name], (error, results) => {
          if (error) {
            res.status(400).send(error);
          }
          else{
            res.status(200).json(results.rows); //empty?
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

}

function updateTournament(req, res){

}

function deleteTournament(req, res){

}

module.exports = router;
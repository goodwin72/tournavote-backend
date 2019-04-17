var express = require('express');
var router = express.Router();
var pool = require('../connectionPool');

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
    response.status(200).json(results.rows)
  });
}

function createTournament(req, res){

}

function getTournament(req, res){

}

function updateTournament(req, res){

}

function deleteTournament(req, res){

}

module.exports = router;
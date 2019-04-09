var express = require('express');
var router = express.Router();
var db = require("../models");
var helpers = require("../helpers");

router.route('/')
  .get(getTournaments)
  .post(createTournament)

router.route('/:tournamentId')
  .get(getTournament)
  .put(updateTournament)
  .delete(deleteTournament)

//-----------------------------------------

function getTournaments(req, res){
  //res.send("HI FROM USER ROOT");
  db.Tournament.find()
  .then(function(tournaments){
    res.json(tournaments);
  })
  .catch(function(err){
    res.send(err);
  })
}

function createTournament(req, res){
  //helpers.doesUserExist(req.body.owner);
  db.User.countDocuments({_id: req.body.owner})
  .then(function(count){
    if(count > 0){
      db.Tournament.create(req.body)
      .then(function(newTournament){
        res.status(201).json(newTournament);
      })
      .catch(function(err){
        res.send(err);
      })
    }
    else{
      res.status(404).send(err);
    }
  })
  .catch(function(err){
    res.send(err);
  })
}

function getTournament(req, res){
  db.Tournament.findById(req.params.tournamentId)
  .then(function(foundTournament){
    res.json(foundTournament);
  })
  .catch(function(err){
    res.send(err);
  })
}

function updateTournament(req, res){
  db.Tournament.findByIdAndUpdate({_id: req.params.tournamentId}, req.body, {new: true})
  .then(function(foundTournament){
    res.status(200).json(foundTournament);
  })
  .catch(function(err){
    res.send(err);
  })
}

function deleteTournament(req, res){
  db.Tournament.remove({_id: req.params.tournamentId})
  .then(function(){
    res.json({message: "Tournament deleted"})
  })
  .catch(function(err){
    res.send(err);
  })
}

module.exports = router;
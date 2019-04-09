var express = require('express');
var router = express.Router();
var db = require("../models");

router.route('/')
  .get(getUsers)
  .post(createUser)

router.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

//-----------------------------------------

function getUsers(req, res){
  //res.send("HI FROM USER ROOT");
  db.User.find()
  .then(function(users){
    res.json(users);
  })
  .catch(function(err){
    res.send(err);
  })
}

function createUser(req, res){
  //res.send('USER POST');
  db.User.create(req.body)
  .then(function(newUser){
    res.status(201).json(newUser);
  })
  .catch(function(err){
    res.send(err);
  })
}

function getUser(req, res){
  db.User.findById(req.params.userId)
  .then(function(foundUser){
    res.json(foundUser);
  })
  .catch(function(err){
    res.send(err);
  })
}

function updateUser(req, res){
  db.User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true})
  .then(function(user){
    res.status(200).json(user);
  })
  .catch(function(err){
    res.send(err);
  })
}

function deleteUser(req, res){
  db.User.remove({_id: req.params.userId})
  .then(function(){
    res.json({message: "User deleted"})
  })
  .catch(function(err){
    res.send(err);
  })
}

module.exports = router;
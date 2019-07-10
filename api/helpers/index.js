
//Requires - Node
const express = require('express');
const session = require('express-session');
const router = express.Router();
const pool = require("../connectionPool");
const bcrypt = require('bcrypt');
const validator = require('validator');

//Requires - Local
const constants = require('../constants');

const getUserData = function(req, cb){
  const userId = req.params.userId;

  if (validator.isUUID(userId, 4)){
    pool.query('SELECT * FROM users WHERE id = $1', [userId], (error, results) => {
      if (error) {
        cb(error, null);
      }
      else{
        //console.log(results.rows[0]);
        cb(error, results.rows[0]);
      }
    });
  }
  else{
    res.status(400).send("Error in request");
  }
}

const checkForLoginMatch = function(username, password, cb){
  pool.query('SELECT * FROM users WHERE name = $1', [username], (error, results) => {
    if(!error && results.rows[0]){
      bcrypt.compare(password, results.rows[0].password, function(err, res) {
        if(res){
          cb(err, results.rows[0]);
        }
        else{
          cb(err, null);
        }
      });
    }
    else{
      cb(error, null);
    }
  });
};

const authorizeRequest = function(req){
  var usernameMatch = req.body.username == req.session.username;
  var passwordMatch = false;
  checkForLoginMatch(req.session.username, req.body.password, (err, res) =>{
    if(res){
      passwordMatch = res;
    }
  });

  return usernameMatch && passwordMatch;
};

const checkIfLoggedIn = function(req){
  if(req.session.userid){
    return true;
  }
  else{
    return false;
  }
}

//why is clearcookie on res?
const clearSession = function(req, res){
  if(checkIfLoggedIn(req)){
    req.session.destroy();
    res.clearCookie(constants.COOKIE_NAME);
    return true;
 }
  else{
    return false;
 }
}

const getParticipantData = function(user_id, tournament_id, cb){
  if (validator.isUUID(user_id, 4)){
    pool.query('SELECT * FROM participants WHERE user_id=$1 AND tournament_id=$2', 
    [user_id, tournament_id], (error, results) => {
      cb(error, results);
    });
  }  
  else{
    res.status(400).send("Error in request");
  }
}

module.exports.getUserData = getUserData;
module.exports.checkForLoginMatch = checkForLoginMatch;
module.exports.authorizeRequest = authorizeRequest;
module.exports.checkIfLoggedIn = checkIfLoggedIn;
module.exports.clearSession = clearSession;
module.exports.getParticipantData = getParticipantData;

//Requires - Node
const express = require('express');
const session = require('express-session');
const router = express.Router();
const pool = require("../connectionPool");
const bcrypt = require('bcrypt');

const getUserData = function(username, cb){
  pool.query('SELECT * FROM users WHERE name = $1', [username], (error, results) => {
    if(error){
      cb(error, null);
    }
    else{
      cb(error, results.rows[0]);
    }
  });
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

module.exports.getUserData = getUserData;
module.exports.checkForLoginMatch = checkForLoginMatch;
module.exports.authorizeRequest = authorizeRequest;
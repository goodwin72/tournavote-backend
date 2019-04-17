//Requires - Node
const express = require('express');
const session = require('express-session');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const validator = require('validator');

//Requires - Local
const pool = require("../connectionPool");
const helpers = require('../helpers');

//Constants
const saltRounds = 10; //best practice?

//Routes
router.route('/')
  .get(getUsers)
  .post(createUser)

router.route('/:userId')
  .get(getUser)

router.route('/me')
  .put(updateUser)
  .delete(deleteUser)

//-----------------------------------------

function getUsers(req, res){
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      res.status(400).send(error);
    }
    else{
      res.status(200).json(results.rows);
    }
  });
}

function createUser(req, res){
  if(req.body.username && req.body.password){
    const newId = uuidv4();

    bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
      if(err){
        res.status(400).send(err);
      }
      else{
        pool.query('INSERT INTO users (id, name, password) VALUES ($1, $2, $3)', 
          [newId, req.body.username, hashedPassword], (error, results) => {
          if (error) {
            res.status(400).send(error);
          }
          else{
            res.status(200).json(results.rows)
          }
       });        
      }      
    })
  }
  else{
    res.status(400).send("Error in request");
  }
}

function getUser(req, res){
  const userId = req.params.userId;

  if (validator.isUUID(userId, 4)){
    pool.query('SELECT * FROM users WHERE id = $1', [userId], (error, results) => {
      if (error) {
        res.status(400).send(error);
        //throw err; //???
      }
      else{
        res.status(200).json(results.rows)
      }
    });
  }
  else{
    res.status(400).send("Error in request");
  }
}

function updateUser(req, res){
  //Get current data
  let userData;
  helpers.getUserData(req.session.username, (error, results) => {
    if(error){
      res.status(400).send("Error in request");
    }
    else{
      userData = results;

      //If logged in to session
      if (userData && validator.isUUID(req.session.userid, 4)){ 
        //Set new data to the old data by default
        let newUsername = req.body.username || userData.name;
        let newPassword = userData.password;

        if(req.body.password){
          newPassword = bcrypt.hashSync(req.body.password, saltRounds);
        }

        pool.query('UPDATE users SET name = $1, password = $2 WHERE id = $3', 
          [newUsername, newPassword, req.session.userid], (error, results) => {
          if (error) {
            res.status(400).send(error);
          }
          else{         
            req.session.username = newUsername;
            console.log("Updated user " + newUsername);
            res.status(200).send("User successfully updated")
          }
        }); 
      }
      else{
        res.status(400).send("Error in request");
      };
    } 
  });
}

function deleteUser(req, res){
  const userId = req.params.userId;

  if (validator.isUUID(userId, 4)){
    pool.query('DELETE FROM users WHERE id = $1', [userId], (error, results) => {
      if (error) {
        res.status(400).send(error);
      }
      else{
        res.status(200).json("User successfully deleted")
      }
    });
  }
  else{
    res.status(400).send("Error in request");
  }
}

module.exports = router;
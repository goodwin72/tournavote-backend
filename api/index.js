//Requires - Node
const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session'); //here?
const pgSession = require('connect-pg-simple')(session); //here?
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

//Requires - Local
const pool = require("./connectionPool");
const helpers = require('./helpers');

//Routes
var usersRoute = require('./routes/users')
var tournamentsRoute = require('./routes/tournaments')
//var optionsRoute = require('./routes/options')

//Constants
const COOKIE_NAME = "tournavote";

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Session management
app.use(session({
   genid: function(req) {
      return uuidv4()
    },
   store: new pgSession({
     pool : pool,
     tableName : 'user_sessions'
   }),
   name: COOKIE_NAME,
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
 }));

//TEST
app.get('/api/', function(req, res){
   if(req.session.username){
      console.log("USERNAME: " + req.session.username);
   }
   else{
      console.log("No one is logged in!");
   }

   res.send("HI FROM ROOT");
});

//Login
app.post('/api/login', function(req, res){
   if(!helpers.checkIfLoggedIn(req)){
      helpers.checkForLoginMatch(req.body.username, req.body.password, (err, match) => {
         if(match){
            //console.log("Match: " + match.id);
            req.session.username = req.body.username;
            req.session.userid = match.id;
            console.log("Logged in " + req.session.username);
            res.status(200).send("Logged in");
         }
         else{
            res.status(400).send("Invalid login");
         }
      });
   }
   else{
      res.status(400).send("Already logged in as " + req.session.username);
   }
});

//Logout
app.post('/api/logout', function(req, res){
   if(helpers.checkIfLoggedIn(req)){
      console.log("Logged out " + req.session.username);
      req.session.destroy();
      res.clearCookie(COOKIE_NAME).status(200).send("Logged out.");
   }
   else{
      res.status(400).send("Can't log out - not logged in.");
   }
});

//Routes from other files
app.use('/api/users', usersRoute);
app.use('/api/tournaments', tournamentsRoute);
//app.use('/api/options', optionsRoute);


app.listen(port, function(){
   console.log("Hello! Running on " + port); 
});

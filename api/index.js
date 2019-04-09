var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var bodyParser = require('body-parser');

var userRoute = require('./routes/user')
var tournamentRoute = require('./routes/tournament')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
   res.send("HI FROM ROOT"); 
});

app.use('/api/users', userRoute);
app.use('/api/tournaments', tournamentRoute);


app.listen(port, function(){
   console.log("Hello! Running on " + port); 
});

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username cannot be blank"
  },
  password: {
    type: String,
    required: "Password cannot be blank"
  }
})

var User = mongoose.model('User', userSchema);

module.exports = User;

//STORE PASSWORD IN A BETTER WAY

//username - string
//password - string
//id - int
//tournaments owned - list int
//tournaments a part of - list int
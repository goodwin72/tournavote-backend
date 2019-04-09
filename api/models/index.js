var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/db'); //rename db?

mongoose.Promise = Promise;

module.exports.User = require("./user");
module.exports.Tournament = require("./tournament");
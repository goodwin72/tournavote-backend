var mongoose = require('mongoose');

var tournamentSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: "Tournament must have owner ID"
  },
  voters: {
    type: [Number],
    default: []
  },
  options: {
    type: [Number],
    default: []
  },
  round: {
    type: Number,
    default: 0
  },
  maxRounds: {
    type: Number,
    default: 0 //update via trigger?
  }
})

var Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;

//TOURNAMENT
//owner id - int
//tournament - id int
//voter ids - list int
//option ids - list int
//current ‘round’ - int
//max number of ‘rounds’ - int
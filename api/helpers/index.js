var db = require("../models");

exports.doesUserExist = function(id){
  db.User.countDocuments({_id: id}, function(err, count){
    console.log("COUNT: " + count);
    if(count > 0){
      return true;
    }
    else{
      return false;
    }
  })
}

module.exports = exports;
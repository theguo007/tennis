/* Schema for users */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: String,							    // serves as unique username
	name: String, 								// name of player
	description: String, 						// short description of skill level
	phoneNumber: Number,							// short blurb about best way to reach user
    password: String
});



var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByEmail = function(email, callback) {
    if(email == "" || email == null){
      return callback(null, null);      
    }
    const query = {email: email};
    User.findOne(query, callback);
}


module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      console.log(err, hash);
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
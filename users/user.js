/* Schema for users */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
	description: String, 						// short description of skill level
	phoneNumber: Number,							// short blurb about best way to reach user
  password: {
    type: String,
    required: true,
    select: false,
  },
});



var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByEmail = function(email, callback) {
    if(email == "" || email == null){
      return callback(null, null);      
    }
    const query = {email: email};
    User.findOne(query, callback);
}

module.exports.getUserByEmailWithPassword = function(email, callback){
  if(email == "" || email == null){
    return callback(null, null);      
  }
  const query = {email: email};
  User.findOne(query,callback).select("+password");
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback).select("+password");
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
    console.log(hash);
    if(err) throw err;
    callback(null, isMatch);
  });
}
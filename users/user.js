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
  },
  description: String,
  birthdate: Date,
  sex: String,
  ntrp: String,
  password: {
    type: String,
    required: true,
    select: false,
  },
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getAllUsers = function(callback) {
  User.find({}, callback);
}

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
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.updateUser = function(usr, callback) {
  User.findById(usr._id, function(err, user){
      if (err) {
        callback(err, null);
      } else {
        user.description = usr.description,
        user.name = usr.name,
        user.birthdate = usr.birthdate,
        user.sex = usr.sex,
        user.ntrp = usr.ntrp;
        user.save(function(err){
          if(err) {
            callback(err, false);
          } else {
           callback(null, true);
          }
        });
      }
      
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
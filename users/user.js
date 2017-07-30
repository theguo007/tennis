/* Schema for users */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	email: String,							    // serves as unique username
	name: String, 								// name of player
	description: String, 						// short description of skill level
	phoneNumber: Number							// short blurb about best way to reach user
});

module.exports = mongoose.model('User', userSchema);
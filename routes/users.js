var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://rogerfederer:greatestofalltime@ds034677.mlab.com:34677/tennis', ['users']);

router.get('/users', function(req, res, next){
	db.users.find(function(err, users){
		if(err){
			res.send(err);
		}
		res.json(users);
	});
});

module.exports = router;

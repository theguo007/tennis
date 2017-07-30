var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://rogerfederer:greatestofalltime@ds034677.mlab.com:34677/tennis');

var User = require('./user');

// Get users
router.get('/users', function(req, res, next){
	User.find(function(err, users){
		if(err) res.send(err);
		res.json(users);
	});
});

// Get user
router.get('/user/:id', function(req, res){
	User.findById(req.params.id, function(err, user) {
        console.log(req.params.id);
		if(err) res.send(err);
    	res.json(user);
  	});
});

// Create user
router.post('/user', function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(user == null){
            var user = new User();
            user.description = req.body.description;
            user.name = req.body.name;
            user.email = req.body.email;
            user.phoneNumber = req.body.phoneNumber;
            user.save(function(err, user) {
                if (err) throw err;
                res.json({ success: true, message: user });
            });
        } else {
            res.json({success: false, message: "username already taken"});
        }
    });
});

// Edit user information (of self)
router.put('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err) res.send(err);
        user.description = req.body.description;
        user.name = req.body.name;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.save(function(err){
            if(err) res.send(err);
            res.json({success: true, message: "user updated"});
        })
    });
});

module.exports = router;

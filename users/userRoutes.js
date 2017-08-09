var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
const config = require('../config/database');

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
    User.getUserByEmail(req.body.email, (err, user) => {
        if(user == null){
            var user = new User({
                description: req.body.description,
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password
            });
            
            User.addUser(user, (err, user) => {
                if(err) {
                    res.json({success: false, msg:'Failed to register'});
                } else {
                    res.json({sucess: true, msg: "User registered"});
                }
            })
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


// login
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

module.exports = router;

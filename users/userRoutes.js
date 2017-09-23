const express = require('express');
const router = express.Router();
// var mongoose = require('mongoose');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const config = require('../config/database');

var User = require('./user');

// Get users
router.get('/users', passport.authenticate('jwt', {session:false}), function(req, res, next){
  User.getAllUsers(function(err, users){
    if(err) res.send(err);
    res.json(users);
  });
});

// Get user
router.get('/users/:id', passport.authenticate('jwt', {session:false}), function(req, res){
  User.getUserById(req.params.id, function(err, user) {    
    if(err) res.send(err);

    user.select("-password");
    res.json(user);
  });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next){
  // res.json(req.headers.authorization.substring(4));
  var decoded = jwt.decode(req.headers.authorization.substring(4))._doc;
  delete decoded.password;
  var x = new User(decoded);
  res.json(x);
});

// Create user
router.post('/users', function(req, res){
    User.getUserByEmail(req.body.email, (err, user) => {
        if(user == null){
            var user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            
            User.addUser(user, (err, user) => {
                if(err) {
                    res.json({success: false, message:'Failed to register' + err});
                } else {
                    res.json({success: true, message: "User registered"});
                }
            })
        } else {
            res.json({success: false, message: "Email already taken"});
        }
    });
});

// Edit user information (of self)
router.put('/users/:id', passport.authenticate('jwt', {session:false}), function(req, res){
  const usr = {
    _id: req.params.id,
    description: req.body.description,
    name: req.body.name,
    email: req.body.email,
  }
  User.updateUser(usr, (err, success) => {
    if (err) {
      res.json({success: false, msg: "There was a problem updating your information."});
    } else {
      res.json({success: true, msg: "User information successfully saved."});
    }
  });
});


// login
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmailWithPassword(email, (err, user) => {
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

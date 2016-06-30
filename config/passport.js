var LocalStrategy    = require('passport-local').Strategy;

var Sequelize = require('sequelize');
var pg = require('pg').native;
var pghstore = require('pg-hstore');

var configDB = require('./database.js');
var sequelize = new Sequelize(configDB.url);
var User = sequelize.import('../models/user');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    // console.log('serializeUser');
    // console.log(user);
    // console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser');
    console.log(id);
    User.findById(id.id).then(function(user){
      done(null, user);
    }).catch(function(e){
      done(e, false);
    });
  });

  passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
      User.findOne({where: {email: email}}).then(function(user){
        if(user && User.validPassword(password)){
          done(null, user);
        } else if(User.validPassword(password)){
          done(null, false, {message: 'incorrect password'})
        } else if(!user){
          done(null, false, {message: 'no user found'});
        }
        console.log('user login function called');
      })
      .catch(function(err){
        done(null, false, {message: err});
      });
  }));

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      console.log('database fetch ');
    User.findOne({ where: { email: email }})
      .then(function(existingUser) {
        console.log('return from database ');
        if (existingUser){
          console.log('user exisits');
          return done(null, false, {message: 'That email is already taken.'});
        }
        else if(req.body) {
          var user = req.body;
          user.email = email;
          user.password = User.generateHash(password);
          User.create({email: user.email, password: user.password})
            .then(function(data) {
              console.log('saved user ' + data.dataValues.email);
              done(null, data.dataValues);
          }).catch(function(err){
            console.log('error saving user');
            console.log(err);
             done(null, false, {message: 'error saving user'});
          });
        }
      })
      .catch(function (e) {
        console.log('error fetching user');
        console.log(e);
        done(null, false, {message: e});
      })
  }));
};

var models = require("../models");

module.exports = function(app, passport){
  app.get('/', function(req, res){
    console.log('getting index');
    res.render('index.html')
  });

  app.post('/login', passport.authenticate('local-login',{
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/'
  }));
}

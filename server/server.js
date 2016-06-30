global.__VERSION__ = require('../package.json').version;
global.__PROD__ = process.env.NODE_ENV === "production";
// global.__API_PROD__ = process.env.API_PROD || hostname;
global.__API_BETA__ = process.env.API_BETA || '127.0.0.1';

// var hostname = (global.__PROD__ ? "BETA HOST" : "PROD HOSE");

var express = require('express'),
  path = require('path'),
  fs = require('fs'),
  uuid = require('uuid'),
  cookieSession = require('cookie-session'),
  cookieParser = require('cookie-parser'),
  assign = require('object-assign'),
  superagent = require('superagent'),
  app = express(),
  bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var models = require("../models");
var routes = require('./routes')

require('../config/passport')(passport); // pass passport for configuration

var TEN_YEARS = 315569259747,
  CAN_PRERENDER = fs.existsSync(path.join(__dirname, '..', 'static', 'app.js')),
  everythingButFilesRegex = /^[^\.]+$/;
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, '..', 'dist'), { maxAge: TEN_YEARS }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  keys: ['superLongKeysAreGreatForLotsOfTyping', 'AnotherKeyIsUsedAsASecondaryKey'],
  secure: global.__PROD__,
  secureProxy: global.__PROD__,
  httpOnly: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// start
models.sequelize.sync().then(function() {
 var server = app.listen(process.env.PORT || 8080,
  function() {
    console.log('Express server listening on port ' + server.address().port);
 });
});
console.log('WebBoarding is up '+ global.__VERSION__);


// app.listen(process.env.PORT || 8080, '0.0.0.0');
// app.use((req, res, next) => {
//   res.setHeader('X-Frame-Options', 'SAMEORIGIN');
//   res.setHeader('X-XSS-Protection', 0);
//   res.setHeader("x-powered-by", '');
//   next();
// });

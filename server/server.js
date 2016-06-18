global.__VERSION__ = require('../package.json').version;
global.__PROD__ = process.env.NODE_ENV === "production";
// global.__API_PROD__ = process.env.API_PROD || hostname;
// global.__API_BETA__ = process.env.API_BETA || hostname;

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

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['superLongKeysAreGreatForLotsOfTyping', 'AnotherKeyIsUsedAsASecondaryKey'],
  secure: global.__PROD__,
  secureProxy: global.__PROD__,
  httpOnly: true
}));

// app
app.use((req, res, next) => {

  if (!req.cookies.sid && (req.url || "").indexOf('heartbeat') === -1){
    req.session.id = uuid.v4();
    req.session.init = +new Date();
    res.cookie('sid', req.session.id);
  }

  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', 0);
  res.setHeader("x-powered-by", '');
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* server proxy */
// app.use('/beta', (req, res) => {
//   forward(global.__API_BETA__, req, res);
// });
//
// app.use('/api', (req, res) => {
//   forward(global.__API_PROD__, req, res);
// });

// function forward(host, req, res){
//   console.log(host);
//   var request = superagent.post(host + req.path);
//
//   res.setHeader('Content-Type', 'application/json, application/javascript;charset=ISO-8859-1');
//
//   var body = assign({}, req.body);
//   var args = assign({}, body.args);
//   delete args['api-token'];
//
//   args['api-token'] = "WebTokenWebIsTheFutureHTML5ForLife";
//
//   body.args = args;
//
//   request
//     .send(body)
//     .pipe(res);
// }
var TEN_YEARS = 315569259747,
  CAN_PRERENDER = fs.existsSync(path.join(__dirname, '..', 'static', 'app.js')),
  everythingButFilesRegex = /^[^\.]+$/;

app.use(everythingButFilesRegex, (req, res)=> {
  (CAN_PRERENDER ?
    res.set({'Cache-Control':'public, max-age='+TEN_YEARS}).send(render(req.baseUrl)) :
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'), { maxAge: TEN_YEARS }))
});

app.use(express.static(path.join(__dirname, '..', 'dist'), { maxAge: TEN_YEARS }));

// If you don't want source files on the public server then remove this
app.use('/build', express.static(path.join(__dirname, '..', 'build')));

// start
console.log(process.env.PORT);
app.listen(process.env.PORT || 8080, '0.0.0.0');


console.log('WebBoarding is up '+ global.__VERSION__);

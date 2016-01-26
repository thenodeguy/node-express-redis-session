'use strict';

// @TODO
// Support for flash messaging
// Support for signing cookies

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbConfig = require('./configs/db');

var redisConfig = require('./configs/redis');
var redisSession = require('./redis/redis');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

// Database setup
mongoose.connect(dbConfig[process.env.NODE_ENV].url);

// Authentication
app.use(function(req, res, next) {
console.log(req.headers.cookie);        // HERE DELETE

  // Behaviour for no cookie.
  var cookie = req.headers.cookie;
  if (!cookie) {
    res.set('Set-Cookie', 'token=visitor');
    res.locals.user = null;
    next();
    return;
  }
  
  // Behaviour for visitor cookie.
  var token = null;
  if (cookie) {
    token = cookie.slice(cookie.indexOf('=') + 1);
    if (token === 'visitor') {
      res.locals.user = null;
      next();
      return;
    }
  }
  
  // Behaviour for session cookie.
  redisSession.get({
    app: redisConfig[process.env.NODE_ENV].redisNamespace,
    token: token},
    function(err, session) {
      if (err) {
        res.set('Set-Cookie', 'token=visitor');
        res.locals.user = null;
        next();
        return;
      }
      
      // Store the token in locals, so we can easily access it later for
      // accessing the session.
      res.locals.token = token;
      
      // Store the bare user details in locals, for fast access. Any changes to
      // user data which update the session should also be reflected in this
      // locals.user object.
      res.locals.user = session.d;
      next();
    });
});

// Routing configuration
var routes = require('./routes/index');
app.use('/', routes);

module.exports = app;

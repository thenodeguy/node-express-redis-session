'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Users = require('../models/users');

var redisConfig = require('../configs/redis');
var redisSession = require('../redis/redis');


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', suppressLoggedInUsers, function(req, res, next) {

  // Flash messages not implemented. The flash message could be stored in the
  // redis session for logged in users. However, to support flash messages for
  // visitors then sessions would need to be created for them also.
  res.render('login', { message: '' });
});

router.post('/login', suppressLoggedInUsers, function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  
  // If this app runs behind a proxy owned by you, then use 'x-forwarded-for'.
  // If not, then it there is a possibility of spoofing, so rely entirely on
  // 'req.connection.remoteAddress'.
  //var userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var userIP = req.connection.remoteAddress;

  var promise = new Promise(function(resolve, reject) {
    Users.findOne({username: username, password: password}, function(err, user) {
      if (err) {
        reject(err);
        return;
      }
      
      if (!user) {
        reject(new Error('Username or password incorrect'));
        return;
      }
      
      resolve(user);
    });
  })
  .then(function(user) {
  
    return new Promise(function(resolve, reject) {
      
      // Create a multi-process user session in Redis.
      redisSession.create({
        app: redisConfig[process.env.NODE_ENV].redisNamespace,
        id: user._id,
        ip: userIP,
        ttl: redisConfig[process.env.NODE_ENV].redisSessionTTL,
        d: { username: user.username }
        },
        function(err, tokenContainer) {
          if (err) {
            reject(err);
            return;
          }

          // tokenContainer.token should be used to identify the user session 
          // in Redis. This token should now be set in the cookie.
          resolve(tokenContainer.token);
        });
    });
  })
  .then(function(token) {
  
    res.set('Set-Cookie', 'token=' + token);
    res.redirect('/dashboard');
  })
  .catch(function(err) {
  
    // Implement flash messenger here. The flash message could be added to
    // the session, and removed from the session by the subsequent consumer,
    // e.g. /login
    console.log(err);
    res.redirect('/login');
    return;
  });
});

router.get('/dashboard', forceLogIn, function(req, res, next) {
  res.render('dashboard');
});

router.get('/logout', forceLogIn, function(req, res, next) {
  res.set('Set-Cookie', 'token=visitor');
  res.redirect('/');
});


function suppressLoggedInUsers(req, res, next) {
  if(res.locals.user) {
    res.redirect('/dashboard');
    return;
  }
  // User is not logged in. Proceed.
  next();
}

function forceLogIn(req, res, next) {
  if(res.locals.user) {
    // User is logged in. Proceed.
    next();
    return;
  }
  // User is not logged in
  res.redirect('/login');
}

module.exports = router;

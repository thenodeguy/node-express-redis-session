'use strict';

// Cheatsheet for redis-session.
// https://www.npmjs.com/package/redis-sessions

var RedisSessions = require('redis-sessions');
var rs = new RedisSessions({ host: '127.0.0.1', port: '6379' });
var namespace = "nodeexpressauthredis";


new Promise(function(resolve, reject) {

  // Create a multi-process user session in Redis.
  rs.create({
    app: namespace,
    id: 'user_id_goes_here',
    ip: '127.0.0.1',
    ttl: 3600,
    d: { username: 'Ann Example' }
    },
    function(err, tokenContainer) {
      if (err) {
        reject(err);
        return;
      }
      
      // tokenContainer.token should be used to look up the user session 
      // in Redis.
      resolve(tokenContainer.token);
    });
})
.then(function(token) {

  // Retrieve the user session.
  return new Promise(function(resolve, reject) {
    rs.get({
      app: namespace,
      token: token},
      function(err, userSession) {
        if (err) {
          reject(err);
          return;
        }
        
        // userSession references the user session, which we created earlier.
        // { username: 'Ann Example' }
        resolve(token);
      });
  });
})
.then(function(token) {

  // Insert new data into the user session.
  return new Promise(function(resolve, reject) {    
    rs.set({
      app: namespace,
      token: token,
      d: {
        'email': 'root@localhost',
        'phone': '0123456'
      }},
      function(err, userSession) {
        if (err) {
          reject(err);
          return;
        }
        
        // userSession references the updated user session.
        // { username: 'Ann Example', email: 'root@localhost', phone: '0123456'}
        resolve(token);
      });
  });
})
.then(function(token) {

  // Remove data from the user session by setting the d key to null.
  return new Promise(function(resolve, reject) {    
    rs.set({
      app: namespace,
      token: token,
      d: {
        "phone": null
      }},
      function(err, userSession) {
        if (err) {
          reject(err);
          return;
        }
        
        // userSession references the updated user session.
        // { username: 'Ann Example', email: 'root@localhost'}
        resolve(token);
      });
  });
})
.then(function(token) {

  // Destroy the user session.
  return new Promise(function(resolve, reject) {    
    rs.kill({
      app: namespace,
      token: token},
      function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        
        // Result indicates whether the session was killed:
        // { kill: 1 }
        resolve();
      });
  });
})
.catch(function(err) {
  console.log(err);
});

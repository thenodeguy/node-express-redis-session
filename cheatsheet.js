'use strict';

// Cheatsheet for redis-session.
// https://www.npmjs.com/package/redis-sessions

var util = require('util');
var RedisSessions = require('redis-sessions');
var rs = new RedisSessions({ host: '127.0.0.1', port: '6379', });
var namespace = 'nodeexpressauthredis';


new Promise(function(resolve, reject) {

  // Create a multi-process user session in Redis.
  rs.create({
    app: namespace,
    id: 'user_id_goes_here',
    ip: '127.0.0.1',
    ttl: 3600,
    d: {
      username: 'Ann Example',
    },
  },
  function(err, tokenContainer) {
    if (err) {
      reject(err);
      return;
    }
    
    // The tokenContainer.token should be used to look up the user session 
    // in Redis.
    console.log('1: ' + tokenContainer.token);
    resolve(tokenContainer.token);
  });
})
.then(function(token) {

  // Retrieve the user session.
  return new Promise(function(resolve, reject) {
    rs.get({
      app: namespace,
      token: token,
    },
    function(err, userSession) {
      if (err) {
        reject(err);
        return;
      }
      
      // The userSession references the newly created user session, e.g:
      // { username: 'Ann Example' }
      console.log('2: ' + util.inspect(userSession.d));
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
        email: 'root@localhost',
        phone: '0123456',
      },
    },
    function(err, userSession) {
      if (err) {
        reject(err);
        return;
      }
      
      // The userSession references the updated user session.
      // { username: 'Ann Example', email: 'root@localhost', phone: '0123456'}
      console.log('3: ' + util.inspect(userSession.d));
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
        phone: null,
      },
    },
    function(err, userSession) {
      if (err) {
        reject(err);
        return;
      }
      
      // The userSession references the updated user session.
      // { username: 'Ann Example', email: 'root@localhost'}
      console.log('4: ' + util.inspect(userSession.d));
      resolve(token);
    });
  });
})
.then(function(token) {

  // Destroy the user session.
  return new Promise(function(resolve, reject) {    
    rs.kill({
      app: namespace,
      token: token,
    },
    function(err, result) {
      if (err) {
        reject(err);
        return;
      }
      
      // Result indicates whether the session was killed:
      // { kill: 1 }
      console.log('5: ' + util.inspect(result));
      resolve();
    });
  });
})
.then(function() {

  process.exit(0);
})
.catch(function(err) {
  console.log(err);
});

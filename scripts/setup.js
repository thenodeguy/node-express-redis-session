'use strict';

/**
 * Run this script once before running the application, to create the users
 * collection and to insert a single default user. The script should only be run
 * once.
 *
 * The default user will have the following credentials:
 *
 * Username: admin
 * Password: admin
 */
var mongoose = require('mongoose');
var dbConfig = require('../configs/db');
var Users = require('../models/users');

mongoose.connect(dbConfig["dev"].url);
process.on('SIGINT', function() {
  console.log('Closing database connection.');
  mongoose.connection.close();
});

var user = new Users();
user.username = 'admin';
user.firstName = 'admin';
user.lastName = 'admin';
user.password = 'admin';

user.save(function(err, user) {
  if (err) {
    console.log('Unable to add default user: ' + err);
    return;
  }

  console.log('Default user successfully added.');
  process.exit(0);
});

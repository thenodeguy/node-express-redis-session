'use strict';

var mongoose = require('mongoose');

var Users = new mongoose.Schema(
{
  // _id added automatically,
  username: String,
  firstName: String,
  lastName: String,
  password: String,
},
{
  collection:"users"
});

module.exports = mongoose.model('users', Users);

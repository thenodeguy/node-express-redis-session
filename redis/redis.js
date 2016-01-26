'use strict';

var redisConfig = require('../configs/redis');
var RedisSessions = require("redis-sessions");

var rs = new RedisSessions({
  host: redisConfig[process.env.NODE_ENV].host,
  port: redisConfig[process.env.NODE_ENV].port
});

module.exports = rs;

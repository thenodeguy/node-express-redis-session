'use strict'

module.exports = {
  prod: {
    redisServerIP: '127.0.0.1',
    redisServerPort: 6379,
    redisSessionTTL: 3600,
    redisNamespace: 'thisappname'
  },
  dev: {
    redisServerIP: '127.0.0.1',
    redisServerPort: 6379,
    redisSessionTTL: 3600,
    redisNamespace: 'thisappname'
  }
};

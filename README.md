# node-express-redis-session

[![Greenkeeper badge](https://badges.greenkeeper.io/bjvickers/node-express-redis-session.svg)](https://greenkeeper.io/)

A basic and lean recipe for using Redis to store sessions.

Demonstrates how the session can be stored in a Redis datastore, essential for
scalable, non-RESTful web-applications that are not using session affinity.

Read the <strong><code>cheatsheet.js</code></strong> for further examples of 
how the session can be created, retrieved, updated and deleted.

Includes a setup script which will create the 
<strong><code>local/users</code></strong> collection and insert a single 
default user:

```
Username: admin  
Password: admin
```

These credentials should be used to log into the application.


Requirements
-
You will need a running MongoDB daemon.  
You will need a running Redis server.


To install
-
```
$ npm install
```


To setup
-
```
$ npm run-script setup
```


To run
-
```
$ sudo npm start
```


To test in a browser
-
http://localhost/


Cheatsheet
-
```
$ vim cheatsheet.js
```

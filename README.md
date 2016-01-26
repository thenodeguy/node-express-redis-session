# node-express-redis-session
A basic and lean recipe for using Redis to store sessions.

Includes a setup script which will create the 'local/users' collection and insert a
single default user:

```
Username: admin  
Password: admin
```

These credentials should be used to test the username/authentication.


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

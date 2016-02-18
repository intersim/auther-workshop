'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

app.use(require('./requestState.middleware'));

app.use(session({
  secret: 'tongiscool'
}));

app.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(require('./logging.middleware'));

app.use(require('./statics.middleware'));

app.post('/login', function (req, res, next) {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  })
  .exec()
  .then(function(user) {
    if (!user) {
      console.log("no such user/password combo!")
      res.sendStatus(401);
    } else {
      console.log('foudn this user: ', user);
      req.session.userId = user._id;
      res.sendStatus(200);
    }
  })
  .then(null, next);
});

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;
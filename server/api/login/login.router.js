'use strict';
var router = require('express').Router();
var HttpError = require('../../utils/HttpError');
var User = require('../users/user.model');

router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.find({
    email: email,
    password: password
  })
  .then(function(user) {
    console.log(user);
    if (user) {
      req.session.userId = user._id;
      res.sendStatus(200);
    }
    else res.sendStatus(401);
  })
  .then(null, next);

});

module.exports = router;
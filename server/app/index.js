'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');

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

app.use(passport.initialize());
app.use(passport.session());

// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/home',
    failureRedirect : '/'
  })
);

// don't forget to install passport-google-oauth
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
    new GoogleStrategy({
        clientID: '14340150421-kh43nr0s9p64c6s8jd1pi382iokec0c5.apps.googleusercontent.com',
        clientSecret: 'mUsIV-dibrPr_0nUtMTKtoki',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
      User.findOne({ 'google.id' : profile.id }, function (err, user) {
    // if there is an error, stop everything and return that
    // ie an error connecting to the database
    if (err) return done(err);
    // if the user is found, then log them in
    if (user) {
        return done(null, user); // user found, pass along that user
    } else {
        // if there is no user found with that google id, create them
        var newUser = new User();
        // set all of the google information in our user model
        newUser.google.id = profile.id; // set the users google id                   
        newUser.google.token = token; // we will save the token that google provides to the user                    
        newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
        newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
        // don't forget to include the user's email, name, and photo
        newUser.email = newUser.google.email; // required field
        newUser.name = newUser.google.name; // nice to have
        newUser.photo = profile.photos[0].value; // nice to have
        // save our user to the database
        newUser.save(function (err) {
            if (err) done(err);
            // if successful, pass along the new user
            else done(null, newUser);
        });
    }
  });
}));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, done);
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
      req.session.userId = user._id;
      console.log("req.session: ", req.session);
      res.status(200).json(user);
    }
  })
  .then(null, next);
});

app.get('/me/', function (req, res, next) {
  User.findById(req.session.userId)
  .exec()
  .then(function (user) {
    res.status(200).json(user)
  })
})

app.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.sendStatus(200);
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
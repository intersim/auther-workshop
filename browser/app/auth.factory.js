'use strict';

app.factory('Auth', function ($http, $state) {
  var AuthFactory = {};

  var currentUser = null;

  $http.get('/me/')
  .then(res => res.data)
  .then(function (user) {
    currentUser = user;
  });

  AuthFactory.submitLogin = function (data) {
    console.log('hit submitLogin!');
    return $http.post('/login', data)
    .then(res => res.data)
    .then(function (user) {
      console.log('authfactory login user', user);
      currentUser = user;
      $state.go('stories');
      return user;
    })
  };

  AuthFactory.signUp = function (data) {
    console.log('hit Sign Up!');
    return $http.post('/api/users', data)
    .then(res => res.data)
    .then(function (user) {
      currentUser = user;
      $state.go('stories');
      return user;
    })
  };

  AuthFactory.logout = function() {
    return $http.get('/logout')
    .then(function(res) {
      currentUser = null;
      console.log('logout response: ', res);
      return res;
    })
  }

  AuthFactory.getCurrentUser = function() {
    console.log('we are in the current user function!!!');
    return currentUser;
  }

  return AuthFactory;
})
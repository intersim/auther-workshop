'use strict';

app.factory('Auth', function ($http, $state) {
  var AuthFactory = {};

  AuthFactory.submitLogin = function (data) {
    console.log('hit submitLogin!');
    return $http.post('/login', data)
    .then(function (res) {
      console.log(res);
      $state.go('stories');
      return res;
    })
  };

  AuthFactory.signUp = function (data) {
    console.log('hit Sign Up!');
    return $http.post('/api/users', data)
    .then(function (res) {
      console.log(res);
      $state.go('stories');
      return res;
    })
  };

  return AuthFactory;
})
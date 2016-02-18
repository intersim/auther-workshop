'use strict'

app.controller('LoginCtrl', function ($scope, $http, $state) {
  $scope.submitLogin = function (data) {
    console.log('hit submitLogin!');
    return $http.post('/login', data)
    .then(function (res) {
      console.log(res);
      $state.go('stories');
      return res;
    })
  };
})
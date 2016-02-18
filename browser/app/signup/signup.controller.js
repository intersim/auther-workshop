'use strict'

app.controller('SignUpCtrl', function ($scope, $http, $state) {
  $scope.signUp = function (data) {
    console.log('hit Sign Up!');
    return $http.post('/api/users', data)
    .then(function (res) {
      console.log(res);
      $state.go('stories');
      return res;
    })
  };
})
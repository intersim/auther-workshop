'use strict'

app.controller('LoginCtrl', function ($scope, Auth) {
  $scope.submitLogin = Auth.submitLogin;
})
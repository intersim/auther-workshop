'use strict'

app.controller('LoginCtrl', function ($scope, Auth) {
  $scope.submitLogin = Auth.submitLogin;
  $scope.currentUser = Auth.getCurrentUser;
})
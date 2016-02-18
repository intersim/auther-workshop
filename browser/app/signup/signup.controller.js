'use strict'

app.controller('SignUpCtrl', function ($scope, Auth) {
  $scope.signUp = Auth.signUp;
  $scope.currentUser = Auth.getCurrentUser;
})
'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, Auth) {
	$scope.story = story;
	$scope.users = users;
  $scope.currentUser = Auth.getCurrentUser;
	$scope.$watch('story', function () {
		$scope.story.save();
	}, true);
});
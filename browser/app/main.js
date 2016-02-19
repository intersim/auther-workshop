'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
  // in the main app.config(function () {...})
  $urlRouterProvider.when('/auth/:provider', function () {
      window.location.reload();
  });
});
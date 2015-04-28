/**
 * App Module
 *
 * Main app module
 */
var app = angular.module('myApp', [
	'ngRoute',
	'homeCtrl',
	'couponDirective',
	'sun.scrollable'
])
	.config(['$routeProvider',
		function ($routeProvider) {
			'use strict';
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);

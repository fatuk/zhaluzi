/**
 * App Module
 *
 * Main app module
 */
var app = angular.module('myApp', [
	'ngRoute',
	'homeCtrl',
	'couponDirective',
	'perfect_scrollbar'
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

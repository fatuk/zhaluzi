/**
 * App Module
 *
 * Main app module
 */
var app = angular.module('myApp', [
	'ngRoute',
	'homeCtrl',
	'couponDirective',
	'progressButton',
	'ng.deviceDetector',
	'sun.scrollable'
])
	.config(['$routeProvider', '$sceProvider',
		function ($routeProvider, $sceProvider) {
			'use strict';
			$sceProvider.enabled(false);
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);

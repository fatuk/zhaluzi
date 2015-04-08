angular.module('homeCtrl', [])
	.controller('HomeCtrl', ['$scope',

		function ($scope) {
			'use strict';

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};
			console.log('home ctrl');
		}
	]);

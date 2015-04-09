angular.module('homeCtrl', [])
	.controller('HomeCtrl', ['$scope',

		function ($scope) {
			'use strict';

			// Scrollr init
			var s = skrollr.init({
				smoothScrolling: true,
				mobileDeceleration: 0.004
			});

			// WOW init
			new WOW().init();

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};
			console.log('home ctrl');
		}
	]);

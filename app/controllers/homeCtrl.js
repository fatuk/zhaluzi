angular.module('homeCtrl', ['ngDialog'])
	.controller('HomeCtrl', ['$scope', 'ngDialog',
		function ($scope, ngDialog) {
			'use strict';

			$scope.init = function () {

			};

			$scope.skrollr = function () {
				var s = skrollr.init({
					smoothScrolling: true,
					mobileDeceleration: 0.004
				});
			};

			$scope.openCollectModal = function () {
				console.log('open');
				ngDialog.open({
					template: 'views/modals/coupon-1.html'
				});
			};

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};

			$scope.collected = [];
			$scope.collect = function (id, e) {
				var $target = $(e.currentTarget);
				$scope.collected.push({
					id: id
				});

				$target.find('.js-coupon').addClass('collected');

				$scope.openCollectModal();
			};
		}
	]);

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
				ngDialog.open({
					template: 'views/modals/coupon-1.html',
					preCloseCallback: function () {
						$scope.currentCoupon.fadeOut('slow');
					}
				});
			};

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};

			$scope.collected = [];
			$scope.currentCoupon = {};
			$scope.collect = function (id, e) {
				$scope.currentCoupon = $(e.currentTarget);
				$scope.collected.push({
					id: id
				});

				$scope.currentCoupon.find('.js-coupon').addClass('collected');

				$scope.openCollectModal();
			};
		}
	]);

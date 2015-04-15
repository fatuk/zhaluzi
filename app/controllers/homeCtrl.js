angular.module('homeCtrl', ['ngDialog'])
	.controller('HomeCtrl', ['$scope', 'ngDialog', 'couponsService', '$log',
		function ($scope, ngDialog, couponsService, $log) {
			'use strict';

			$scope.collected = [];
			$scope.currentCouponEl = {};
			$scope.currentCouponId = '';
			$scope.couponMessages = [];
			$scope.coupons = [];
			$scope.couponsOnStage = [];

			$scope.init = function () {
				$scope.getCouponMessages();
				$scope.getCoupons();
			};

			$scope.getCouponMessages = function () {
				couponsService.getMessages()
					.then(function (res) {
						// Success
						$scope.couponMessages = res;
					}, function (err) {
						// Error
						$log.error(err);
					});
			};

			$scope.getCoupons = function () {
				couponsService.getAllCoupons()
					.then(function (res) {
						// Success
						$scope.coupons = res;
						$scope.gambleCoupons();
					}, function (err) {
						// Error
						$log.error(err);
					});
			};

			$scope.random = function (min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};

			$scope.gambleCoupons = function () {
				var floorsCount = $scope.coupons.length;

				for (var i = 0; i < floorsCount; i++) {
					var max = $scope.coupons[i].coupons.length - 1,
						rnd = $scope.random(0, max),
						randomCoupon = $scope.coupons[i].coupons[rnd];

					$scope.couponsOnStage.push(randomCoupon);
					console.log(randomCoupon);
				};
			};

			$scope.skrollr = function () {
				var s = skrollr.init({
					smoothScrolling: true,
					mobileDeceleration: 0.004
				});
			};

			$scope.openCollectModal = function () {
				ngDialog.open({
					template: 'views/modals/coupon.html',
					preCloseCallback: function () {
						$scope.currentCouponEl.fadeOut('slow');
					},
					scope: $scope
				});
			};

			$scope.discount = function () {
				return $scope.collected.length * 2;
			};

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};

			$scope.collect = function (id, e) {
				$scope.currentCouponEl = $(e.currentTarget);
				$scope.currentCouponId = id;
				$scope.collected.push({
					id: id
				});

				$scope.currentCouponEl.find('.js-coupon').addClass('collected');

				$scope.openCollectModal();
			};

			$scope.init();
		}
	]);

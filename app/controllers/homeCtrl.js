angular.module('homeCtrl', ['ngDialog'])
	.controller('HomeCtrl', ['$scope', 'ngDialog', 'couponsService', '$log', '$timeout',
		function ($scope, ngDialog, couponsService, $log, $timeout) {
			'use strict';

			$scope.collected = [];
			$scope.currentCouponEl = {};
			$scope.currentCouponId = '';
			$scope.couponMessages = [];
			$scope.coupons = [];
			$scope.couponsOnStage = [];
			$scope.callMeHover2 = false;

			$scope.init = function () {
				$scope.getCouponMessages();
				$scope.getCoupons();
				$scope.skrollr();
			};

			// For points position adjusting
			$scope.getLocation = function (e) {
				var width = $('body').width(),
					height = $('body').height(),
					x = e.pageX,
					y = e.pageY;

				console.info(x / width * 100 + '%, ' + y + 'px');
			};

			$scope.callMeShow = function () {
				console.log('mouse over');
				var offCallMeFn = $scope.$on("mouseover", function () {
					console.log('unregister mouse over');
				});

				offCallMeFn();

				//this will deregister that listener
				offCallMeFn();
				$timeout(function (e) {
					// e.preventDefault();
					$scope.callMeHover2 = true;
				}, 0);
			};

			$scope.callMeHide = function () {
				$timeout(function () {
					$scope.callMeHover2 = false;
				}, 500);
			};

			$scope.hideIt = function () {
				$timeout(function () {
					$scope.hovering = false;
				}, 500); // 500ms delay
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

					randomCoupon.floor = i + 1;

					$scope.couponsOnStage.push(randomCoupon);
				}
			};

			$scope.skrollr = function () {
				var s = skrollr.init({
					smoothScrolling: false,
					mobileDeceleration: 0.004
				});
			};

			$scope.openCollectModal = function () {
				ngDialog.open({
					template: 'views/modals/coupon.html',
					preCloseCallback: function () {
						$scope.currentCouponEl.fadeOut('slow');
					},
					scope: $scope,
					className: 'ngdialog ngdialog_coupon ngdialog-theme-default'
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

angular.module('homeCtrl', ['ngDialog', 'ngStorage'])
	.controller('HomeCtrl', [
		'$scope',
		'ngDialog',
		'couponsService',
		'$log',
		'$timeout',
		'$localStorage',
		function ($scope, ngDialog, couponsService, $log, $timeout, $localStorage) {
			'use strict';

			$scope.collected = $localStorage.$default({
				counter: 0
			});
			$scope.floors = $localStorage.$default({
				floorsArray: []
			});
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
				var width = $('.js-house').width(),
					height = $('.js-house').height(),
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
				var floorsCount = $scope.coupons.length,
					couponsIdArray = [];

				// Get coupons flat id array
				_.each($scope.coupons, function (item, i) {
					couponsIdArray.push(i + 1);
				});

				// Get rest floors
				$scope.actualFloors = _.difference(couponsIdArray, $scope.floors.floorsArray);

				for (var i = 0; i < $scope.actualFloors.length; i++) {
					var max = $scope.coupons[$scope.actualFloors[i] - 1].coupons.length - 1,
						rnd = $scope.random(0, max),
						randomCoupon = $scope.coupons[$scope.actualFloors[i] - 1].coupons[rnd];

					randomCoupon.floor = $scope.actualFloors[i];
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
				return $scope.collected.counter * 2;
			};

			$scope.menuToggle = function () {
				this.menuState = !this.menuState;
			};

			$scope.collect = function (id, e) {
				$scope.currentCouponEl = $(e.currentTarget);
				$scope.currentCouponId = id;

				$scope.collected.counter++;

				$scope.currentCouponEl.find('.js-coupon').addClass('collected');

				$scope.openCollectModal();

				$scope.floors.floorsArray.push($scope.currentCouponId);
			};

			$scope.init();
		}
	]);

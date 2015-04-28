angular.module('homeCtrl', ['ngDialog', 'ngStorage', 'angular-inview'])
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

			$scope.init = function () {
				$scope.setCouponsContainerWidth();
				$scope.getCouponMessages();
				$scope.getCoupons();
				$scope.skrollr();
				$scope.map();
			};

			$scope.openTooltipModal = function () {
				$timeout(function () {
					$('html').addClass('block-scroll');
				}, 300);
				ngDialog.open({
					template: 'views/modals/tooltip.html',
					scope: $scope,
					preCloseCallback: function () {
						$timeout(function () {
							$('html').removeClass('block-scroll');
						}, 300);
					},
					className: 'ngdialog ngdialog_tooltip ngdialog-theme-default'
				});
			};

			$scope.map = function () {
				$('.js-map').gmap3({
					marker: {
						latLng: [55.762024, 37.559649],
						options: {
							animation: 'DROP',
							icon: {
								url: 'img/pin.png'
							}
						}
					},
					map: {
						// address: "POURRIERES, Москва",
						options: {
							center: [55.759534, 37.652598],
							zoom: 13,
							mapTypeControl: false,
							panControl: false,
							ZoomControlOptions: false,
							navigationControl: false,
							scrollwheel: false,
							disableDefaultUI: true,
							streetViewControl: false,
							styles: [{
								"featureType": "administrative",
								"elementType": "labels.text.fill",
								"stylers": [{
									"color": "#444444"
								}]
							}, {
								"featureType": "landscape",
								"elementType": "all",
								"stylers": [{
									"color": "#f2f2f2"
								}]
							}, {
								"featureType": "poi",
								"elementType": "all",
								"stylers": [{
									"visibility": "off"
								}]
							}, {
								"featureType": "road",
								"elementType": "all",
								"stylers": [{
									"saturation": -100
								}, {
									"lightness": 45
								}]
							}, {
								"featureType": "road.highway",
								"elementType": "all",
								"stylers": [{
									"visibility": "simplified"
								}]
							}, {
								"featureType": "road.arterial",
								"elementType": "labels.icon",
								"stylers": [{
									"visibility": "off"
								}]
							}, {
								"featureType": "transit",
								"elementType": "all",
								"stylers": [{
									"visibility": "off"
								}]
							}, {
								"featureType": "water",
								"elementType": "all",
								"stylers": [{
									"color": "#46bcec"
								}, {
									"visibility": "on"
								}]
							}]
						}
					}
				});
			};

			$scope.wow = function () {
				new WOW().init();
			};

			// Set coupons container width
			$scope.setCouponsContainerWidth = function () {
				var $couponsContainer = $('.js-couponsContainer');
				$couponsContainer.css({
					width: $(window).width()
				});
			};

			// For points position adjusting
			$scope.getLocation = function (e) {
				var $couponsContainer = $('.js-couponsContainer'),
					width = $couponsContainer.width(),
					height = $('body').height(),
					x = e.pageX,
					y = e.pageY;

				console.info(x / width * 100 + '%, ' + y + 'px');
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

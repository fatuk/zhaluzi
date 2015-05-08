/**
 * App Module
 *
 * Main app module
 */
var app = angular.module('myApp', [
	'ngRoute',
	'homeCtrl',
	'couponDirective',
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

angular.module('homeCtrl', ['ngDialog', 'ngStorage', 'angular-inview'])
	.controller('HomeCtrl', [
		'$scope',
		'ngDialog',
		'couponsService',
		'$log',
		'$timeout',
		'$localStorage',
		'detectUtils',
		'notificationService',
		'promoCodeService',
		function ($scope, ngDialog, couponsService, $log, $timeout, $localStorage, detectUtils, notificationService, promoCodeService) {
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
			$scope.tooltipModals = [];
			$scope.userData = {};
			$scope.userData.phone = '+7';

			$scope.init = function () {
				$scope.setCouponsContainerWidth();
				$scope.getCouponMessages();
				$scope.getCoupons();
				$scope.getTooltipModals();
				if (!$scope.isMobile()) {
					$scope.skrollr();
				}
				$scope.map();
			};

			$scope.sendPromo = function () {
				var data = {
					email: $scope.userData.email,
					promocodeId: $scope.collected.counter
				};
				promoCodeService.sendPromoCode(data)
					.then(function (res) {
						// Success
						console.log(res);
					}, function (err) {
						// Error
						console.log(err);
					});
			};

			$scope.sendCallMe = function () {
				var data = {
					phone: $scope.userData.phone,
					header: 'Перезвоните мне. Промо-сайт Дизайн окна',
					text: 'Пользователь оставил свой номер телефона и попросил перезвонить.'
				};
				notificationService.sendUserData(data)
					.then(function (res) {
						// Success
						console.log(res);
					}, function (err) {
						// Error
						console.log(err);
					});
			};

			$scope.sendCallMeZhaluzi = function () {
				var data = {
					phone: $scope.userData.phone,
					header: 'Хочу заказать ' + $scope.userData.zhaluziType + '. Промо-сайт Дизайн окна',
					text: 'Я хочу заказать ' + $scope.userData.zhaluziType + ' и задать по ним вопросы.'
				};
				notificationService.sendUserData(data)
					.then(function (res) {
						// Success
						console.log(res);
					}, function (err) {
						// Error
						console.log(err);
					});
			};

			$scope.sendPromo = function () {
				var data = {
					email: $scope.userData.email,
					promocodeId: $scope.collected.counter
				};
				promoCodeService.sendPromoCode(data)
					.then(function (res) {
						// Success
						console.log(res);
					}, function (err) {
						// Error
						console.log(err);
					});
			};

			$scope.sendComment = function () {
				var data = {
					email: $scope.userData.email,
					header: 'Комментарий пользователя. Промо-сайт Дизайн окна',
					text: $scope.userData.comment
				};
				notificationService.sendUserData(data)
					.then(function (res) {
						// Success
						console.log(res);
					}, function (err) {
						// Error
						console.log(err);
					});
			};

			$scope.isMobile = function () {
				return detectUtils.isMobile();
			};

			$scope.scrollTo = function (hash) {
				var $body = $('html, body'),
					scrollLocation = $('#' + hash)[0].offsetTop,
					modals = {};

				modals['desk-horizontal'] = 1;
				modals['desk-wood'] = 2;
				modals['desk-rollet'] = 3;
				modals['desk-vertical'] = 4;
				modals['desk-zebra'] = 5;

				$scope.mobileMenuState = false;
				$scope.menuState = false;

				setTimeout(function () {
					$body.animate({
						scrollTop: scrollLocation
					}, '500', function () {

					});

					setTimeout(function () {
						if (modals[hash]) {
							// Open modal
							$scope.openTooltipModal(modals[hash]);
						}
					}, 800);
				}, 500);
			};

			$scope.getViewSize = function () {
				alert($(window).width() + 'x' + $(window).height());
			};

			$scope.getTooltipModals = function () {
				couponsService.getTooltipModals()
					.then(function (res) {
						// Success
						$scope.tooltipModals = res;
					}, function (err) {
						// Error
						$log.error(err);
					});
			};

			$scope.openAccordion = function (e) {
				var $accordion = $(e.target).parents('.accordion');

				if (!$accordion.hasClass('expanded')) {
					$('.accordion').removeClass('expanded');
					$accordion.addClass('expanded');
				} else {
					$accordion.removeClass('expanded');
				}
			};

			$scope.openTooltipModal = function (id) {
				$scope.tooltipId = id;
				/*$timeout(function () {
					$('html').addClass('block-scroll');
				}, 300);*/
				ngDialog.open({
					template: 'views/modals/tooltip.html',
					scope: $scope,
					preCloseCallback: function () {
						/*				$timeout(function () {
					$('html').removeClass('block-scroll');
				}, 300);*/
					},
					className: 'ngdialog ngdialog_tooltip ngdialog-theme-default'
				});
			};

			$scope.openGetDiscountModal = function () {
				/*$timeout(function () {
					$('html').addClass('block-scroll');
				}, 300);*/
				ngDialog.open({
					template: 'views/modals/get-discount.html',
					scope: $scope,
					preCloseCallback: function () {
						/*				$timeout(function () {
					$('html').removeClass('block-scroll');
				}, 300);*/
					},
					className: 'ngdialog ngdialog_discount ngdialog-theme-default'
				});
			};

			$scope.map = function () {
				$('.js-map').gmap3({
					marker: {
						latLng: [55.648677, 37.735566],
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
							center: [55.648677, 37.735566],
							zoom: 14,
							zoomControl: true,
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
					// width: $(window).width()
					width: 1600
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
				$scope.menuState = !$scope.menuState;
			};

			$scope.mobileMenuToggle = function () {
				$scope.mobileMenuState = !$scope.mobileMenuState;
			};

			$scope.collect = function (id, e) {
				$scope.currentCouponEl = $(e.currentTarget);
				$scope.currentCouponId = id;

				$scope.collected.counter++;

				$scope.currentCouponEl.find('.js-coupon').addClass('collected');

				$scope.openCollectModal();

				$scope.floors.floorsArray.push($scope.currentCouponId);
			};

			$scope.clearCollected = function () {
				localStorage.clear();
				location.reload();
			};

			$scope.init();
		}
	]);

angular.module('couponDirective', [])
	.controller('couponCtrl', ['$scope',
		function ($scope) {
			'use strict';
		}
	])
	.directive('coupon', [

		function () {
			'use strict';
			return {
				restrict: 'E',
				templateUrl: 'views/coupon/index.html',
				scope: {},
				replace: true,
				link: function (scope, el, attr) {
					var locationArray = attr.location.split(','),
						left = $.trim(locationArray[0]),
						top = $.trim(locationArray[1]);

					scope.id = attr.id;
					scope.floor = attr.floor;
					scope.img = attr.img;
					scope.type = attr.type;

					el.css({
						left: left,
						top: top
					});
				}
			};
		}
	]);

/*app.controller('scrollCtrl', [
	'$scope',
	function ($scope) {
		console.log($scope);
	}
])
	.directive('scroll', function ($window) {
		return {
			scope: {},
			link: function (scope, element, attrs) {
				angular.element($window).bind('scroll', function () {
					console.log('scroll');
					console.log(scope.menuState);
					// $('.site-header').removeClass('expanded');

					scope.$apply();
				});
			}
		};
	});
*/

app.service('couponsService', ['$http', '$q',

	function ($http, $q) {
		var coupon = this;
		coupon.couponMessages = {};
		coupon.tooltipModals = {};
		coupon.coupons = [];

		coupon.getTooltipModals = function () {
			var defer = $q.defer();

			$http.get('data/tooltip-modals.json')
				.success(function (res) {
					coupon.tooltipModals = res;
					defer.resolve(res);
				})
				.error(function (err, status) {
					defer.reject(err);
				});

			return defer.promise;
		};

		coupon.getMessages = function () {
			var defer = $q.defer();

			$http.get('data/coupon-messages.json')
				.success(function (res) {
					coupon.couponMessages = res;
					defer.resolve(res);
				})
				.error(function (err, status) {
					defer.reject(err);
				});

			return defer.promise;
		};

		coupon.getAllCoupons = function () {
			var defer = $q.defer();

			$http.get('data/coupons.json')
				.success(function (res) {
					coupon.coupons = res;
					defer.resolve(res);
				})
				.error(function (err, status) {
					defer.reject(err);
				});

			return defer.promise;
		};



		return coupon;
	}
]);

app.service('notificationService', ['$http', '$q',

	function ($http, $q) {
		var notification = this;

		notification.sendUserData = function (data) {
			var defer = $q.defer();

			$http.post('send_notification.php', data)
				.success(function (res) {
					defer.resolve(res);
				})
				.error(function (err, status) {
					defer.reject(err);
				});

			return defer.promise;
		};

		return notification;
	}
]);

app.service('promoCodeService', ['$http', '$q',

	function ($http, $q) {
		var promoCode = this;

		promoCode.sendPromoCode = function (data) {
			var defer = $q.defer();

			$http.post('send_promocode.php', data)
				.success(function (res) {
					defer.resolve(res);
				})
				.error(function (err, status) {
					defer.reject(err);
				});

			return defer.promise;
		};

		return promoCode;
	}
]);

//# sourceMappingURL=../js/app.js.map
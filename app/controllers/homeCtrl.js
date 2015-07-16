angular.module('homeCtrl', ['ngDialog', 'ngStorage', 'angular-inview'])
	.controller('HomeCtrl', [
		'$interval',
		'$scope',
		'ngDialog',
		'couponsService',
		'$log',
		'$timeout',
		'$localStorage',
		'detectUtils',
		'notificationService',
		'promoCodeService',
		'$rootScope',
		'$window',
		'$routeParams',
		function ($interval, $scope, ngDialog, couponsService, $log, $timeout, $localStorage, detectUtils, notificationService, promoCodeService, $rootScope, $window, $routeParams) {
			'use strict';

			// Hashes for sections
			$scope.$on('$routeChangeSuccess', function () {
				switch ($routeParams.section) {
				case 'horizontal':
					$scope.scrollTo('desk-horizontal');
					break;
				case 'vertical':
					$scope.scrollTo('desk-vertical');
					break;
				case 'rollet':
					$scope.scrollTo('desk-rollet');
					break;
				case 'zebra':
					$scope.scrollTo('desk-zebra');
					break;
				case 'wood':
					$scope.scrollTo('desk-wood');
					break;
				case 'contacts':
					$scope.scrollTo('desk-contacts');
					break;
				}
			});

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
			$scope.progress = [];
			$scope.progressMessage = [];
			$scope.isCallMe = false;
			$scope.isCallMeZhaluzi = false;
			$scope.isPromoCode = false;
			$scope.isComment = false;

			$scope.init = function () {
				$scope.setCouponsContainerWidth();
				$scope.getCouponMessages();
				$scope.getCoupons();
				$scope.getTooltipModals();
				if (!$scope.isMobile()) {
					$scope.skrollr();
					if ($scope.collected.counter == 0) {
						$scope.openHelloModal();
					}
				}
				$scope.map();
			};
			$rootScope.$on('ngDialog.opened', function (e, $dialog) {
				$scope.lockScroll();
			});
			$scope.lockScroll = function () {
				$('.ngdialog-overlay').on('DOMMouseScroll mousewheel', function (ev) {
					var $this = $(this),
						scrollTop = this.scrollTop,
						scrollHeight = this.scrollHeight,
						height = $this.height(),
						delta = (ev.type == 'DOMMouseScroll' ?
							ev.originalEvent.detail * -40 :
							ev.originalEvent.wheelDelta),
						up = delta > 0;

					var prevent = function () {
						ev.stopPropagation();
						ev.preventDefault();
						ev.returnValue = false;
						return false;
					};

					if (!up && -delta > scrollHeight - height - scrollTop) {
						// Scrolling down, but this will take us past the bottom.
						$this.scrollTop(scrollHeight);
						return prevent();
					} else if (up && delta > scrollTop) {
						// Scrolling up, but this will take us past the top.
						$this.scrollTop(0);
						return prevent();
					}
				});
			};

			// Close desctop menu when scroll
			angular.element($window).bind('scroll', function (e) {
				if ($scope.menuState) {
					$scope.menuState = false;
				}
			});

			$scope.simulateProgress = function (buttonName, seconds, message, callback) {
				$scope.progress[buttonName] = 0;
				var interval = $interval(function () {
					$scope.progress[buttonName] += 0.2;

					if ($scope.progress[buttonName] >= 1.0) {
						$interval.cancel(interval);

						$scope.progressMessage[buttonName] = message;

						$timeout(function () {
							$scope.progress[buttonName] = 0;
							$scope.progressMessage[buttonName] = 'Send';
						}, 2000);

						if (typeof callback === 'function') {
							callback();
						}
					}
				}, (seconds / 5) * 1000);
			};

			$scope.sendPromo = function (isWrong) {
				if (!isWrong) {
					var data = {
						email: $scope.userData.email,
						promocodeId: $scope.collected.counter
					};
					promoCodeService.sendPromoCode(data)
						.then(function (res) {
							// Success
							$scope.simulateProgress('promoCode', 1, 'Готово', function () {
								setTimeout(function () {
									$scope.progressMessage['promoCode'] = 'Отправить купон!';
								}, 1500);
							});
						}, function (err) {
							// Error
							$scope.simulateProgress('promoCode', 1, 'Ошибка', function () {
								setTimeout(function () {
									$scope.progressMessage['promoCode'] = 'Отправить купон!';
								}, 1500);
							});
							console.log(err);
						});
				}
			};

			$scope.sendCallMe = function (isWrong) {
				if (!isWrong) {
					var data = {
						phone: $scope.userData.phone,
						header: 'Перезвоните мне. Промо-сайт Дизайн окна',
						text: 'Пользователь оставил свой номер телефона и попросил перезвонить.'
					};

					notificationService.sendUserData(data)
						.then(function (res) {
							// Success
							$scope.simulateProgress('callMe', 1, 'Готово', function () {
								setTimeout(function () {
									$scope.progressMessage['callMe'] = 'Жду звонка!';
								}, 1500);
							});
						}, function (err) {
							// Error
							console.log(err);
							$scope.simulateProgress('callMe', 1, 'Ошибка', function () {
								setTimeout(function () {
									$scope.progressMessage['callMe'] = 'Жду звонка!';
								}, 1500);
							});
						});
				}
			};

			$scope.sendCallMeZhaluzi = function (isWrong) {
				if (!isWrong) {
					var data = {
						phone: $scope.userData.phone,
						header: 'Хочу заказать ' + $scope.userData.zhaluziType + '. Промо-сайт Дизайн окна',
						text: 'Я хочу заказать ' + $scope.userData.zhaluziType + ' и задать по ним вопросы.'
					};
					notificationService.sendUserData(data)
						.then(function (res) {
							// Success
							$scope.simulateProgress('callMeZhaluzi', 1, 'Готово', function () {
								setTimeout(function () {
									$scope.progressMessage['callMeZhaluzi'] = 'Жду звонка!';
								}, 1500);
							});
						}, function (err) {
							// Error
							$scope.simulateProgress('callMeZhaluzi', 1, 'Ошибка', function () {
								setTimeout(function () {
									$scope.progressMessage['callMeZhaluzi'] = 'Жду звонка!';
								}, 1500);
							});
							console.log(err);
						});
				}
			};

			$scope.sendComment = function (isWrong) {
				if (!isWrong) {
					var data = {
						email: $scope.userData.email,
						header: $scope.userData.name + ' оставил комментарий. Промо-сайт Дизайн окна',
						text: $scope.userData.comment
					};
					notificationService.sendUserData(data)
						.then(function (res) {
							// Success
							$scope.simulateProgress('comment', 1, 'Готово', function () {
								setTimeout(function () {
									$scope.progressMessage['comment'] = 'Отправить';
								}, 1500);
							});
						}, function (err) {
							// Error
							console.log(err);
							$scope.simulateProgress('comment', 1, 'Ошибка', function () {
								setTimeout(function () {
									$scope.progressMessage['comment'] = 'Отправить';
								}, 1500);
							});
						});
				}
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
				ngDialog.open({
					template: 'views/modals/tooltip.html',
					scope: $scope,
					preCloseCallback: function () {

					},
					className: 'ngdialog ngdialog_tooltip ngdialog-theme-default'
				});
			};

			$scope.openHelloModal = function () {
				ngDialog.open({
					template: 'views/modals/hello.html',
					showClose: false,
					scope: $scope,
					preCloseCallback: function () {

					},
					className: 'ngdialog ngdialog_discount ngdialog-theme-default'
				});
			};

			$scope.openGetDiscountModal = function () {
				ngDialog.open({
					template: 'views/modals/get-discount.html',
					scope: $scope,
					preCloseCallback: function () {

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

				$scope.currentCouponEl.addClass('cbutton--click');

				setTimeout(function () {
					$scope.openCollectModal();
				}, 500);


				$scope.floors.floorsArray.push($scope.currentCouponId);
			};

			$scope.clearCollected = function () {
				localStorage.clear();
				location.reload();
			};

			$scope.init();
		}
	]);

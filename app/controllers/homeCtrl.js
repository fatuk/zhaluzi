angular.module('homeCtrl', ['ngDialog'])
	.controller('HomeCtrl', ['$scope', 'ngDialog',
		function ($scope, ngDialog) {
			'use strict';

			$scope.collected = [];
			$scope.currentCouponEl = {};
			$scope.currentCouponId = '';
			$scope.couponMessages = [{
				id: 1,
				title: 'Ты просто Шерлок! Ты нашел первый купон!',
				description: 'Можешь оформить скидку 2% на жалюзи прямо сейчас. Для этого оставь свой email и мы отправим на него промо-код с инструкцией.'
			}, {
				id: 2,
				title: 'Ура, второй купон!',
				description: 'Можешь оформить скидку 4% на жалюзи прямо сейчас. Для этого оставь свой email и мы отправим на него промо-код с инструкцией.'
			}, {
				id: 3,
				title: 'Третий купон у тебя в кармане',
				description: 'Можешь оформить скидку 6% на жалюзи прямо сейчас. Для этого оставь свой email и мы отправим на него промо-код с инструкцией.'
			}, {
				id: 4,
				title: 'Невероятно! Чертыре купона это серьезно!',
				description: 'Можешь оформить скидку 8% на жалюзи прямо сейчас. Для этого оставь свой email и мы отправим на него промо-код с инструкцией.'
			}, {
				id: 5,
				title: 'Ты нашел последний пятый купон!',
				description: 'Можешь оформить скидку 10% на жалюзи прямо сейчас. Для этого оставь свой email и мы отправим на него промо-код с инструкцией.'
			}];

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
		}
	]);

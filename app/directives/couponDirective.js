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

					el.css({
						left: left,
						top: top
					});
				}
			};
		}
	]);

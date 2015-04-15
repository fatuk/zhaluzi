angular.module('app', [])
	.service('couponsService', ['$http', '$q',
		function ($http, $q) {
			var coupons = this;
			coupons.couponsList = {};

			coupons.init = function () {

			};

			coupons.getCoupons = function () {
				var defer = $q.defer();

				$http.get('data/coupons.json')
					.success(function (res) {
						coupons.couponsList = res;
						defer.resolve(res);
					})
					.error(function (err, status) {
						defer.reject(err);
					});

				return defer.promise;
			};

		}
	]);

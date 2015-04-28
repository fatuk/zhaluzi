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

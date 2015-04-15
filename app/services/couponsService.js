app.service('couponsService', ['$http', '$q',

	function ($http, $q) {
		var coupon = this;
		coupon.couponMessages = {};

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



		return coupon;
	}
]);

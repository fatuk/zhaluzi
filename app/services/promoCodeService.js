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

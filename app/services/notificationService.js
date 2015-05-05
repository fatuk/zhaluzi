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

app.controller('scrollCtrl', [
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
					$('.site-header').removeClass('expanded');

					scope.$apply();
				});
			}
		};
	});

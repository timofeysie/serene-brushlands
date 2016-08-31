/**
 * @memberof myApp
 * @class login.LoginCtrl
 * @description Controller for login.
 */
angular.module('artApp.login', [
	'auth0'
])
	.controller('LoginCtrl', [
		'$scope',
		'$window',
		'auth',
		'$location',
		'store',
		function ($scope, $window, auth, $location, store) {
			$scope.auth = auth;

			$scope.login = function () {
				auth.signin({}, function (profile, token) {
					store.set('profile', profile);
					store.set('token', token);
					$window.location.reload();
				}, function (error) {
					console.log("There was an error logging in", error);
				});
			}
			$scope.signout = function () {
				$scope.auth = null;
				store.remove('profile');
				store.remove('token');
				$location.path('/login');
				$window.location.reload();
			}

		}]);

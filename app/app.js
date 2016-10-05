'use strict';

/**
 * @memberOf artApp
 * @class artApp
 * @description Contains dependencies, routing, Firebase, Auth0 and responsive set up..
 */
angular.module('artApp', [
	'ngRoute',
	'auth0',
	'angular-storage',
	'angular-jwt',
	'firebase',
	'artApp.navbar',
	'artApp.view1',
	'artApp.view2',
	'artApp.view3',
	'artApp.add',
	'artApp.version',
	'artApp.home',
	'artApp.login',
	'artApp.userPermissions',
	'artApp.locations',
	'artApp.inspections',
	'artApp.data',
	'artApp.directives'
])
	.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/view1', {
				templateUrl: 'views/view1/view1.html',
				requiresLogin: true
			})
				.when('/locations', {
					templateUrl: 'views/view1/locations.html',
					requiresLogin: true
				})
				.when('/locations/:artist', {
					templateUrl: 'views/view1/locations.html',
					requiresLogin: true,
				})
				.when('/data', {
					templateUrl: 'views/view1/data.html',
					requiresLogin: true
				})
				.when('/view2/:artist', {
					templateUrl: 'views/view2/view2.html',
					controller: 'View2Ctrl',
					requiresLogin: true
				})
				.when('/view3/:paintingNo', {
					templateUrl: 'views/view3/view3.html',
					requiresLogin: true
				})
				.when('/login', {
					templateUrl: 'views/login/login.html',
					pageTitle: 'Login',
					controller: 'LoginCtrl'
				})
				.when('/add', {
					templateUrl: 'views/view3/add.html',
					pageTitle: 'Add',
					requiresLogin: true
				})
				.when('/inspections', {
					templateUrl: 'views/view3/inspections.html',
					requiresLogin: true
				})
				.when('/user-permissions', {
					templateUrl: 'views/userPermissions/userPermissions.html',
					requiresLogin: true,
					controller: 'UserPermissionsCtrl',
					resolve: ["IsAuthorizedService", "$location", function (IsAuthorizedService, $location) {
							return IsAuthorizedService.checkAuth('manage-user-permissions')
								.then(function (response) {
									return response;
								}, function (error) {
									alert("Unauthorized")
									$location.path("/");
								});
						}]
				})
				.otherwise({redirectTo: '/login'});
		}])
	.config(function (authProvider) {
		var envValues = document.getElementById('env-values').value;
		var response = JSON.parse(envValues);
		authProvider.init({
			domain: response.AUTH0_DOMAIN,
			clientID: response.AUTH0_CLIENT_ID,
			loginUrl: '/login'
		});
	})
	.run(function (auth, $window, $rootScope, store, jwtHelper, $location) {
		$rootScope.permissions = {};
		var envValues = document.getElementById('env-values').value;
		var response = JSON.parse(envValues);
		$rootScope.firebaseUri = response.FIREBASE_URI;
		auth.hookEvents();

		if ($window.innerWidth < 900) {
			$rootScope.smallWidth = true;
		}
		if ($window.innerWidth < 1200 && $window.innerWidth > 900) {
			$rootScope.mediumWidth = true;
		}

		$rootScope.$on('$locationChangeStart', function () {

			var token = store.get('token');
			if (token) {
				if (!jwtHelper.isTokenExpired(token)) {
					if (!auth.isAuthenticated) {
						//Re-authenticate user if token is valid
						auth.authenticate(store.get('profile'), token);
					}
				} else {
					// Either show the login page or use the refresh token to get a new idToken
					$location.path('/');
				}
			}
		});

		angular.element($window).bind('resize', function () {
			if ($window.innerWidth < 900) {
				$rootScope.smallWidth = true;
			} else {
				$rootScope.smallWidth = false;
			}
			if ($window.innerWidth < 1200 && $window.innerWidth > 900) {
				$rootScope.mediumWidth = true;
			} else {
				$rootScope.mediumWidth = false;
			}
			$rootScope.$digest();
		});
	});

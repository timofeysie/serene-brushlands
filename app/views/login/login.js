/**
 * @memberof myApp
 * @class login.LoginCtrl
 * @description Controller for login.
 */
angular.module("artApp.login", [
    "auth0.lock"
])
    .controller("LoginCtrl", [
        "$rootScope",
        "$scope",
        "$window",
        "lock",
        "$location",
        "store",
        "AuthService",
        function ($rootScope, $scope, $window, lock, $location, store, AuthService) {
            $scope.auth = lock;

            $scope.login = function () {
                lock.show();
            };

            $scope.signout = function () {
                console.log('test');
                $scope.auth = null;
                AuthService.logout();
//                $location.path("/login");
            };

        }
    ]);

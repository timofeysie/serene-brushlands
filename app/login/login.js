/**
 * @memberof myApp
 * @class login.LoginCtrl
 * @description Controller for login.
 */
angular.module( 'myApp.login', [
  'auth0'
])
.controller( 'LoginCtrl', function ($scope, auth, $location, store) {
  $scope.auth = auth;
  $scope.login = function() {
    auth.signin({}, function(profile, token) {
      store.set('profile', profile);
      store.set('token', token);
      $location.path("/");
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }
  $scope.signout = function () {
    $scope.auth = null;
    console.log('logout');
  }

});

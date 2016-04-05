'use strict';

/**
 * @memberOf myApp
 * @class myApp
 * @description Contains dependencies, routing, Firebase, Auth0 and responsive set up..
 */
var response;
var xhttp = new XMLHttpRequest();
xhttp.open("GET", "/env", true);
xhttp.send();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    response  = JSON.parse(xhttp.responseText);
    angular.module('myApp', [
      'ngRoute',
      'auth0', 
      'angular-storage', 
      'angular-jwt',
      'firebase',
      'myApp.navbar',
      'myApp.view1',
      'myApp.view2',
      'myApp.view3',
      'myApp.add',
      'myApp.version',
      'myApp.home',
      'myApp.login',
      'myApp.locations',
      'myApp.inspections',
      'myApp.data',
      'myApp.directives'
    ]).
    config(['$routeProvider', function($routeProvider, authProvider) {
      $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        requiresLogin: true
      })
      .when('/locations', {
        templateUrl: 'view1/locations.html',
        requiresLogin: true
      })
      .when('/data', {
        templateUrl: 'view1/data.html',
        requiresLogin: true
      })
      .when('/view2/:artist', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl',
        requiresLogin: true
      })
      .when('/view3/:paintingNo', { 
        templateUrl: 'view3/view3.html',
        requiresLogin: true
      })
      .when( '/login', {
        templateUrl: 'login/login.html',
        pageTitle: 'Login',
        controller: 'LoginCtrl'
      })
      .when( '/add', {
        templateUrl: 'view3/add.html',
        pageTitle: 'Add',
        requiresLogin: true
      })
      .when( '/inspections', {
        templateUrl: 'view3/inspections.html',
        requiresLogin: true
      })
      .otherwise({redirectTo: '/login'});
    }])
    .config(function (authProvider) {
        authProvider.init({
          domain: response.AUTH0_DOMAIN,
          clientID: response.AUTH0_CLIENT_ID,
          loginUrl: '/login'
        });
    })
    .run(function(auth, $window, $rootScope, $http) {
      $rootScope.firebaseUri = response.FIREBASE_URI;
      
      auth.hookEvents();

      // responsive size variables
      // the first time thru we need to initialize the sceen sizes
      if ($window.innerWidth < 900) {
        $rootScope.smallWidth = true;
      }
      if ($window.innerWidth < 1200 && $window.innerWidth > 900) {
        $rootScope.mediumWidth = true;
      }

      // now we can update those sizes when the screen size changes
      angular.element($window).bind('resize', function() {
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
        // manuall $digest required as resize event
        // is outside of angular
        $rootScope.$digest();
        //console.log('width '+$window.innerWidth);
      });
    });
  }
};

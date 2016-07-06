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
  'mm.acl',
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
.config(['AclServiceProvider', function (AclServiceProvider) {
var myConfig = {
  storage: 'localStorage',
  storageKey: 'AppAcl'
};
AclServiceProvider.config(myConfig);
}])
.config(['$routeProvider', function($routeProvider, authProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'views/view1/view1.html',
    requiresLogin: true
  })
  .when('/locations', {
    templateUrl: 'views/view1/locations.html',
    requiresLogin: true,
    resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('admin')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            alert("Does not have permissions");
            return $q.reject('Unauthorized');
          }
        }]
      }
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
  .when( '/login', {
    templateUrl: 'views/login/login.html',
    pageTitle: 'Login',
    controller: 'LoginCtrl'
  })
  .when( '/add', {
    templateUrl: 'views/view3/add.html',
    pageTitle: 'Add',
    requiresLogin: true
  })
  .when( '/inspections', {
    templateUrl: 'views/view3/inspections.html',
    requiresLogin: true
  })
  .when( '/user-permissions', {
    templateUrl: 'views/userPermissions/userPermissions.html',
    requiresLogin: true,
    controller:'UserPermissionsCtrl',
    resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('admin')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            alert("Does not have permissions");
            return $q.reject('Unauthorized');
          }
        }]
      }
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
.run(function(auth, $window, $rootScope, store, jwtHelper, $location) {
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

  $rootScope.$on('$locationChangeStart', function() {

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
    $rootScope.$digest();
  });
})
.run(['AclService', function (AclService) {

  // Set the ACL data. Normally, you'd fetch this from an API or something.
  // The data should have the roles as the property names,
  // with arrays listing their permissions as their value.
  var roleBasedPermissions = document.getElementById('role-permissions').value;

  delete roleBasedPermissions.userRoles;

  var aclData = JSON.parse(roleBasedPermissions);

  AclService.setAbilities(aclData);

  // Attach the member role to the current user
  var profile = JSON.parse(localStorage.getItem('profile'));
  if(profile == null)
  {
    var email = null;
  }else {
    var email =profile.email;
  }
  AclService.attachRole(email);
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {
  // If the route change failed due to our "Unauthorized" error, redirect them
  $rootScope.$on('$routeChangeError', function(current, previous, rejection){
    if(rejection === 'Unauthorized'){
      $location.path('/');
    }
  });
}]);

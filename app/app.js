"use strict";

/**
 * @memberOf artApp
 * @class artApp
 * @description Contains dependencies, routing, Firebase, Auth0 and responsive set up..
 */
angular.module("artApp", [
    "ngRoute",
    "auth0.lock",
    "angular-storage",
    "angular-jwt",
    "firebase",
    "artApp.navbar",
    "artApp.view1",
    "artApp.view2",
    "artApp.view3",
    "artApp.add",
    "artApp.version",
    "artApp.home",
    "artApp.login",
    "artApp.userPermissions",
    "artApp.locations",
    "artApp.inspections",
    "artApp.data",
    "artApp.directives"
])
    .config([
        "$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix("");
            $routeProvider.when("/view1", {
                templateUrl: "views/view1/view1.html",
                requiresLogin: true
            })
                .when("/locations", {
                    templateUrl: "views/view1/locations.html",
                    requiresLogin: true
                })
                .when("/locations/:artist", {
                    templateUrl: "views/view1/locations.html",
                    requiresLogin: true
                })
                .when("/data", {
                    templateUrl: "views/view1/data.html",
                    requiresLogin: true
                })
                .when("/view2/:artist", {
                    templateUrl: "views/view2/view2.html",
                    controller: "View2Ctrl",
                    requiresLogin: true
                })
                .when("/view3/:paintingNo", {
                    templateUrl: "views/view3/view3.html",
                    requiresLogin: true
                })
                .when("/login", {
                    templateUrl: "views/login/login.html",
                    pageTitle: "Login",
                    controller: "LoginCtrl"
                })
                .when("/add", {
                    templateUrl: "views/view3/add.html",
                    pageTitle: "Add",
                    requiresLogin: true,
                    resolve: [
                        "IsAuthorizedService", "$location", function (IsAuthorizedService, $location) {
                            return IsAuthorizedService.checkAuth("upload-and-backup-artworks")
                                .then(function (response) {
                                    return response;
                                }, function (error) {
                                    alert("Unauthorized");
                                    $location.path("/");
                                });
                        }
                    ]
                })
                .when("/inspections", {
                    templateUrl: "views/view3/inspections.html",
                    requiresLogin: true
                })
                .when("/user-permissions", {
                    templateUrl: "views/userPermissions/userPermissions.html",
                    requiresLogin: true,
                    controller: "UserPermissionsCtrl",
                    resolve: [
                        "IsAuthorizedService", "$location", function (IsAuthorizedService, $location) {
                            return IsAuthorizedService.checkAuth("manage-user-permissions")
                                .then(function (response) {
                                    return response;
                                }, function (error) {
                                    alert("Unauthorized");
                                    $location.path("/");
                                });
                        }
                    ]
                })
                .otherwise({redirectTo: "/login"});
        }
    ])
    .config(function (lockProvider) {
        var envValues = document.getElementById("env-values").value;
        var response = JSON.parse(envValues);

        lockProvider.init({
            domain: response.AUTH0_DOMAIN,
            clientID: response.AUTH0_CLIENT_ID,
            options: {
                autoclose: true,
                auth: {
                    responseType: "token id_token",
                    redirect: false,
                    audience: "https://" + response.AUTH0_DOMAIN + "/userinfo",
                    params: {
                        scope: "openid profile email"
                    }
                }
            }
        });
    })
    .run(function (lock, $window, $rootScope, store, jwtHelper, $location, AuthService, $route) {

        lock.on("authenticated", function (authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                AuthService.createSession(authResult);
                if ($rootScope.redirect) {
                    $location.path($rootScope.redirect);
                } else {
                    $location.path("/view1");
                }
            }
        });

        lock.on("authorization_error", function (err) {
            console.log(err);
        });

        $rootScope.permissions = {};
        var envValues = document.getElementById("env-values").value;
        var response = JSON.parse(envValues);
        $rootScope.firebaseUri = response.FIREBASE_URI;
//		lock.hookEvents();

        if ($window.innerWidth < 900) {
            $rootScope.smallWidth = true;
        }
        if ($window.innerWidth < 1200 && $window.innerWidth > 900) {
            $rootScope.mediumWidth = true;
        }

        $rootScope.$on("$locationChangeStart", function (obj, to, from) {
            $rootScope.isAuthenticated = AuthService.isAuthenticated();
            var pices = to.split("/");
            var isPathlogin = pices.pop() == "login";
            if (AuthService.isAuthenticated()) {

                if (isPathlogin) {
                    $location.path("/view1");
                }
                return;
            } else {

                if (!isPathlogin) {
                    $rootScope.redirect = to;
                }
                $location.path("/login");
            }
        });

        angular.element($window).bind("resize", function () {
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
;

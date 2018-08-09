"use strict";

angular.module("artApp.navbar", [])
    .directive("navbar", function ($window, $rootScope, AuthService) {
        return {
            restrict: "E",
            templateUrl: "components/navbar/navbar.template.html",
            link: function (scope, element) {
                scope.signout = function () {
                    AuthService.logout();
                };
                // Set the initial value for the responsive menu
                scope.width = false;
                if ($window.innerWidth < 600) {
                    scope.smallWidth = true;
                }

                angular.element($window).bind("resize", function () {
                    if ($window.innerWidth < 600) {
                        scope.smallWidth = true;
                    } else {
                        scope.smallWidth = false;
                    }
                    // manuall $digest required as resize event is outside of angular
                    scope.$digest();
                });

            }
        }
            ;
    });

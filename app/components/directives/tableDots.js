'use strict';

angular.module('myApp.directives', [])
.directive('tableDots', function($window) {
  return {
  	restrict: 'E',
    templateUrl: 'components/directives/tableDots.template.html',
    link: function (scope, element) {

    	// Set the initial value for the responsive menu
    	scope.width = false;
    	if ($window.innerWidth < 900) {
        		scope.smallWidth = true;
        }

        angular.element($window).bind('resize', function() {
        	if ($window.innerWidth < 900) {
        		scope.smallWidth = true;
        	} else
        	{
        		scope.smallWidth = false;
        	}
         	// manuall $digest required as resize event
         	// is outside of angular
         	scope.$digest();
       });

        // Adjust the width of dots
        scope.getElementDimensions = function () {
          //console.log(element);
          //return { 'h': element.height(), 'w': element.width() };
          return null;
        };

        scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
          //console.log('new ',newValue);
        }, true);

        // old controller pattern variables
        // viewModel.patternWidth  = 10;
        // viewModel.patternHeight = 10;
        // viewModel.circleCx      = 5;
        // viewModel.circleCy      = 5;
        // viewModel.circleRadius  = 5;
        // viewModel.rectX         = 0;
        // viewModel.rectY         = 0;

    }
  };
});
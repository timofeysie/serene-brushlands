'use strict';
/**
 * @memberof myApp
 * @class view1.View1Ctrl
 * @description Controller for view 1.
 */
angular.module('artApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http','$rootScope',function($scope, $http,$rootScope) {
  $scope.test = 'testing';
	var viewModel = this;
    viewModel.errorMessage = {status:false,message:""};
  	viewModel.paintings = [];
  	$http.get('artworks').success(function(data) {
      viewModel.paintings = data;
  	}).error(function(err){
    viewModel.errorMessage = {status:true,message:"Please upload Artworks Documentation."};
    });
}]);
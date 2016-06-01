'use strict';
/**
 * @memberof myApp
 * @class view1.View1Ctrl
 * @description Controller for view 1.
 */
angular.module('artApp.view1', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$firebaseObject', '$http','$rootScope',function($scope, $firebase, $http,$rootScope) {
    
    $scope.viewModel = {};
    $scope.viewModel.errorMessage = {status:false,message:""};
    $scope.viewModel.paintings = [];
    
    if ($scope.viewModel.paintings.length == 0) {
        
        $scope.viewModel.spinner = true;
        var uploadedArtworksRef =new Firebase($rootScope.firebaseUri+"/uploaded-artworks");
        uploadedArtworksRef.on("value", function(data){
            var retriveData = data.val();
            
            for (var key in retriveData) {
                $scope.viewModel.paintings.push(retriveData[key]);
            }
            
            $scope.viewModel.spinner = false;
            
            if(!$scope.$$phase) {
                $scope.$apply($scope.viewModel);
            }
            
        }, function(errorObject){
            console.log("read failed" + errorObject.code);
            $scope.viewModel.errorMessage = {status:true,message:"Please upload artwork data."};
            $scope.viewModel.spinner = false;
        });
        $scope.viewModel.errorMessage = {status:false,  message:""};
        
    } else {
        
      console.log('viewModel.paintings already exist',$scope.viewModel.paintings.length);
      $scope.viewModel.spinner = false;
      
    }
    
}]);
'use strict';
/**
 * @memberof myApp
 * @class view2.View2Ctrl
 * @description Controller for view 2.
 */
angular.module('artApp.view2', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','$rootScope' ,'$routeParams', '$http',
  function($scope, $rootScope, $routeParams, $http) {
    
    var artistsRef =new Firebase($rootScope.firebaseUri+"/artists/"+$routeParams.artist);
    var viewModel = this;
    $scope.updatedMessage = {"status":false,"msg":""};
    $scope.editModeEnabled = false;
    
    artistsRef.once("value", function(data) {
        var retrivedArtistData = data.val();
        if(retrivedArtistData !== null)
        {
          viewModel.name = retrivedArtistData.name;
          viewModel.bio = retrivedArtistData.bio;
          viewModel.skinName = retrivedArtistData.skinName;
          viewModel.language = retrivedArtistData.language;
          viewModel.region = retrivedArtistData.region;
          viewModel.dreaming = retrivedArtistData.dreaming;
          viewModel.DOB = retrivedArtistData.DOB;
          $scope.$apply(viewModel);  
        }      
    });
    
    $scope.saveTitleAndBody = function(controller)
    {
      var updateArtistsBioRef =new Firebase($rootScope.firebaseUri+"/artists/"+$routeParams.artist+"/bio");
      
      var onComplete = function(error) {
          if (error) {
            $scope.updatedMessage.status= true;
            $scope.updatedMessage.msg= "Failed to update";
          } else {
            $scope.updatedMessage.status= true;
            $scope.updatedMessage.msg= "Updated successfully";
          }
          $scope.editModeEnabled = false;
          $scope.$apply($scope.updatedMessage);
        };
          
        updateArtistsBioRef.child('title').set(controller.bio.title,onComplete);
        updateArtistsBioRef.child('body').set(controller.bio.body,onComplete);
		updateArtistsBioRef.child('AASDLink').set(controller.bio.AASDLink,onComplete);
		updateArtistsBioRef.child('WikiLink').set(controller.bio.WikiLink,onComplete);
    };
    
    
   $scope.getAASDLink=function()
   {
	   if(viewModel.bio.AASDLink!=""){
		   return "http://www.aasd.com.au/index.cfm/artist/?concat="+viewModel.bio.AASDLink;
	   }else{
			var full_name=viewModel.name.split(" ");
			return "http://www.aasd.com.au/index.cfm/artist/?concat="+full_name[0]+"+"+full_name[1];
	   }
   }   
     
	$scope.getWikiLink=function()
   {
	   if(viewModel.bio.WikiLink!=""){
		   return "https://en.wikipedia.org/wiki/"+viewModel.bio.WikiLink;
	   }else{
			var full_name=viewModel.name.split(" ");
			return "https://en.wikipedia.org/wiki/"+full_name[0]+"_"+full_name[1];
	   }
   }
 /* data available:
  "SkinName":"Mbitjana / Mpetyane",
    "Language":"Anmatyerre",
    "Region":"Utopia, Central Australia",
    "Dreaming":"Bush Berry , Bush Plum, Awelye & Bush Melon",
    "DOB":"c.1945",
  */  
}]);
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
    
    var artistsRef = new Firebase($rootScope.firebaseUri + "/artists/" + $routeParams.artist);
    $scope.viewModel = {};
    $scope.updatedMessage = {"status":false,"msg":""};
    $scope.editModeEnabled = false;
    artistsRef.on("value", function(data) {
        var retrivedArtistData = data.val();
        if(retrivedArtistData !== null)
        {
            $scope.viewModel.name = retrivedArtistData.name;
            $scope.viewModel.bio = retrivedArtistData.bio;
            $scope.viewModel.skinName = retrivedArtistData.skinName;
            $scope.viewModel.language = retrivedArtistData.language;
            $scope.viewModel.region = retrivedArtistData.region;
            $scope.viewModel.dreaming = retrivedArtistData.dreaming;
            $scope.viewModel.DOB = retrivedArtistData.DOB;
            $scope.viewModel.AASDLink = $scope.getAASDLink();
            $scope.viewModel.wikiLink = $scope.getWikiLink();
            
            $scope.editModel = angular.copy($scope.viewModel);
        }  
        if(!$scope.$$phase) {
            $scope.$apply($scope.viewModel);
        }
    });
    
    $scope.saveTitleAndBody = function (obj)
    {
        var updateArtistsBioRef = new Firebase($rootScope.firebaseUri + "/artists/" + $routeParams.artist + "/bio");

        var onComplete = function (error) {
            if (error) {
                $scope.updatedMessage.status = true;
                $scope.updatedMessage.msg = "Failed to update";
            } else {
                $scope.updatedMessage.status = true;
                $scope.updatedMessage.msg = "Updated successfully";
            }
            $scope.editModeEnabled = false;
            if(!$scope.$$phase) {
                $scope.$apply($scope.viewModel);
            }
        };

        updateArtistsBioRef.child('title').set(obj.bio.title, onComplete);
        updateArtistsBioRef.child('body').set(obj.bio.body, onComplete);
        updateArtistsBioRef.child('AASDLink').set(obj.bio.AASDLink, onComplete);
        updateArtistsBioRef.child('WikiLink').set(obj.bio.WikiLink, onComplete);
    };


    $scope.getAASDLink = function ()
    {
        if ($scope.viewModel.bio.AASDLink != "") {
            return "http://www.aasd.com.au/index.cfm/artist/?concat=" + $scope.viewModel.bio.AASDLink;
        } else {
            var full_name = $scope.viewModel.name.split(" ");
            return "http://www.aasd.com.au/index.cfm/artist/?concat=" + full_name[0] + "+" + full_name[1];
        }
    }; 

    $scope.getWikiLink = function ()
    {
        if ($scope.viewModel.bio.WikiLink != "") {
            return "https://en.wikipedia.org/wiki/" + $scope.viewModel.bio.WikiLink;
        } else {
            var full_name = $scope.viewModel.name.split(" ");
            return "https://en.wikipedia.org/wiki/" + full_name[0] + "_" + full_name[1];
        }
    };
 /* data available:
  "SkinName":"Mbitjana / Mpetyane",
    "Language":"Anmatyerre",
    "Region":"Utopia, Central Australia",
    "Dreaming":"Bush Berry , Bush Plum, Awelye & Bush Melon",
    "DOB":"c.1945",
  */  
}]);
'use strict';
/**
 * @memberof myApp
 * @class locations.LocationsCtrl
 * @description Controller for locations.
 */
angular.module('artApp.locations', ['ngRoute'])

.controller('LocationsCtrl', ['$scope', '$http','$rootScope',
  function($scope, $http, $rootScope) { 
	var viewModel = this;
  $scope.officelocations = [{"name":"All","value":""}];
  $scope.selectedLocation = $scope.officelocations[0].value;
  var newJsonArray = [];
  $scope.spinner = true;
  var uploadedArtworksRef =new Firebase($rootScope.firebaseUri+"/uploaded-artworks");
  //$http.get('/artworks').success(function(data) {
  uploadedArtworksRef.once("value", function(data) {
	  var retrivedData = data.val();
      for (var key in retrivedData) {
        newJsonArray.push(retrivedData[key]);
      }
    var newData = [];
    var locationBg = 0;
    var currentLocation = '';
		for (var i = 0;i<newJsonArray.length;i++) {
			var item = newJsonArray[i];
      /* Cycle thru 0 - 3 different backgound colors based on location */
      try {
        if (currentLocation.replace('-','') === item.officeLocation.replace('-','')) {
          item.locationBg = 'locationBg'+locationBg; // set the same backgound
        } else {
          currentLocation = item.officeLocation;
          locationBg++; // go to next color if location is different from last loop
          if (locationBg >4) {
            locationBg = 0; // if it's over 2 go back to 0
          }
          item.locationBg = 'locationBg'+locationBg; // set the new bg to be used here
        }
      } catch (error) {
        //console.log('no location');
      }
      $scope.officelocations.push({"name":item.officeLocation,"value":item.officeLocation});
      newData.push(item);
		}
    viewModel.artworks = newData;
	$scope.spinner = false;
	$scope.$apply(viewModel);
	});
}]);

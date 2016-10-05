'use strict';
/**
 * @memberof artApp.locations
 * @class locations.LocationsCtrl
 * @description Controller for locations.
 */
angular.module('artApp.locations', ['ngRoute'])

	.controller('LocationsCtrl', ['$scope', '$rootScope', '$routeParams', 'IsAuthorizedService',
		function ($scope, $rootScope, $routeParams, IsAuthorizedService) {

			var viewModel = this;
			$scope.officelocations = [];
			$scope.selectedLocation = "";
			$scope.artists = [];
			$scope.selectedArtist = "";
			if ($routeParams.artist) {
				$scope.selectedArtist = $routeParams.artist;
			}

			IsAuthorizedService.checkAuth("view-location-insured-and-provenance")
				.then(function (response) {
					$rootScope.permissions["view-location-insured-and-provenance"] = true;
				}, function (error) {
					$rootScope.permissions["view-location-insured-and-provenance"] = false;
				});

			var newJsonArray = [];
			$scope.spinner = true;
			var uploadedArtworksRef = new Firebase($rootScope.firebaseUri + "/uploaded-artworks");
			//$http.get('/artworks').success(function(data) {
			uploadedArtworksRef.on("value", function (data) {
				var retrivedData = data.val();
				for (var key in retrivedData) {
					newJsonArray.push(retrivedData[key]);
				}
				var newData = [];
				var locationBg = 0;
				var currentLocation = '';
				for (var i = 0; i < newJsonArray.length; i++) {
					var item = newJsonArray[i];

					/* Cycle thru 0 - 3 different backgound colors based on location */
					try {
						if (currentLocation.replace('-', '') === item.officeLocation.replace('-', '')) {
							item.locationBg = 'locationBg' + locationBg; // set the same backgound
						} else {
							currentLocation = item.officeLocation;
							locationBg++; // go to next color if location is different from last loop
							if (locationBg > 4) {
								locationBg = 0; // if it's over 2 go back to 0
							}
							item.locationBg = 'locationBg' + locationBg; // set the new bg to be used here
						}
					} catch (error) {
						//console.log('no location');
					}

					if ($scope.officelocations.indexOf(item.officeLocation) == -1) {
						$scope.officelocations.push(item.officeLocation);
					}

					if ($scope.artists.indexOf(item.artist) == -1 && item.artist !== "") {
						$scope.artists.push(item.artist);
					}

					newData.push(item);
				}
				viewModel.artworks = newData;
				$scope.spinner = false;
				if (!$scope.$$phase) {
					$scope.$apply(viewModel);
				}
			});
		}]);

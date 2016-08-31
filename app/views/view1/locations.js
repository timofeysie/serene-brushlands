'use strict';
/**
 * @memberof artApp.locations
 * @class locations.LocationsCtrl
 * @description Controller for locations.
 */
angular.module('artApp.locations', ['ngRoute'])

	.controller('LocationsCtrl', ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'AclService',
		function ($scope, $http, $rootScope, $routeParams, $location, AclService) {

			var isAdmin = false;

			if (AclService.can("admin")) {
				isAdmin = true;
			} else {
				isAdmin = false;
			}

			var viewModel = this;
			$scope.isAdmin = isAdmin;
			$scope.officelocations = [];
			$scope.selectedLocation = "";
			$scope.artists = [];
			$scope.selectedArtist = "";
			if ($routeParams.artist) {
				$scope.selectedArtist = $routeParams.artist;
			}

			var newJsonArray = [];
			$scope.spinner = true;
			var uploadedArtworksRef = new Firebase($rootScope.firebaseUri + "/uploaded-artworks");
			//$http.get('/artworks').success(function(data) {
			uploadedArtworksRef.limitToFirst(10).on("value", function (data) {

				var retrivedData = data.val();
				for (var key in retrivedData) {
					newJsonArray.push(retrivedData[key]);
				}
				var newData = [];
				var locationBg = 0;
				var currentLocation = '';
				for (var i = 0; i < newJsonArray.length; i++) {
					var item = newJsonArray[i];

					console.log(isAdmin);
					if (isAdmin) {
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

					} else {
						item.officeLocation = "";
						item.insured = "";
						item.provenance = "";
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

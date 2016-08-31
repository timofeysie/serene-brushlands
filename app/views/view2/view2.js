'use strict';
/**
 * @memberof artApp
 * @class artApp.View2
 * @description Controller for view 2.
 */
angular.module('artApp.view2', ['ngRoute', 'firebase'])

	.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/view2', {
				templateUrl: 'view2/view2.html',
				controller: 'View2Ctrl'
			});
		}])

	.controller('View2Ctrl', ['$scope', '$rootScope', '$routeParams', '$http',
		function ($scope, $rootScope, $routeParams, $http) {
			$scope.getAASDLink = function (obj)
			{
				if (obj.bio.AASDLink != "") {
					return "http://www.aasd.com.au/index.cfm/artist/?concat=" + obj.bio.AASDLink;
				} else if (obj.name != "") {
					var full_name = obj.name.split(" ");
					return "http://www.aasd.com.au/index.cfm/artist/?concat=" + full_name[1] + full_name[0];
				} else {
					return "";
				}
			};

			$scope.getWikiLink = function (obj)
			{
				if (obj.bio.WikiLink != "" || $scope.viewModel.bio.WikiLink == undefined) {
					return "https://en.wikipedia.org/wiki/" + $scope.viewModel.bio.WikiLink;
				} else if (obj.name != "") {
					var full_name = obj.name.split(" ");
					return "https://en.wikipedia.org/wiki/" + full_name[0] + "_" + full_name[1];
				} else {
					return "";
				}
			};

			var artistsRef = new Firebase($rootScope.firebaseUri + "/artists/" + $routeParams.artist);
			$scope.viewModel = {};
			$scope.viewModel.spinner = true;
			$scope.updatedMessage = {"status": false, "msg": ""};
			$scope.editModeEnabled = false;
			artistsRef.on("value", function (data) {
				var retrivedArtistData = data.val();
				if (retrivedArtistData !== null)
				{
					$scope.viewModel.name = retrivedArtistData.name;
					$scope.viewModel.bio = retrivedArtistData.bio;
					$scope.viewModel.skinName = retrivedArtistData.skinName;
					$scope.viewModel.language = retrivedArtistData.language;
					$scope.viewModel.region = retrivedArtistData.region;
					$scope.viewModel.dreaming = retrivedArtistData.dreaming;
					$scope.viewModel.DOB = retrivedArtistData.DOB;
					$scope.viewModel.AASDLink = $scope.getAASDLink($scope.viewModel);
					$scope.viewModel.wikiLink = $scope.getWikiLink($scope.viewModel);

					$scope.editModel = angular.copy($scope.viewModel);
				} else {
					$scope.updatedMessage = {status: true, msg: "No data available"};
				}
				$scope.viewModel.spinner = false;
				if (!$scope.$$phase) {
					$scope.$apply($scope.viewModel);
				}
			}, function (errObj) {
				console.log("error occurd " + errObj);
				$scope.updatedMessage.status = true;
				$scope.updatedMessage.msg = "Something went wrong. Cannot load data";
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
					if (!$scope.$$phase) {
						$scope.$apply($scope.viewModel);
					}
				};

				updateArtistsBioRef.child('title').set(obj.bio.title, onComplete);
				updateArtistsBioRef.child('body').set(obj.bio.body, onComplete);
				updateArtistsBioRef.child('AASDLink').set(obj.bio.AASDLink, onComplete);
				updateArtistsBioRef.child('WikiLink').set(obj.bio.WikiLink, onComplete);
			};

			/* data available:
			 "SkinName":"Mbitjana / Mpetyane",
			 "Language":"Anmatyerre",
			 "Region":"Utopia, Central Australia",
			 "Dreaming":"Bush Berry , Bush Plum, Awelye & Bush Melon",
			 "DOB":"c.1945",
			 */
		}]);
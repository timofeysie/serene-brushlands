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

	.controller('View2Ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$sce',
		function ($scope, $rootScope, $routeParams, $http, $sce) {
			function urlify(text) {
				var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
				return text.replace(urlRegex, function (url, b, c) {
					var url2 = (c == 'www.') ? 'http://' + url : url;
					return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
				})
			}

			$scope.getAASDLink = function (obj)
			{
				if (obj.bio.AASDLink) {
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
				if (obj.bio.WikiLink) {
					return "https://en.wikipedia.org/wiki/" + obj.bio.WikiLink;
				} else if (obj.name != "") {
					var full_name = obj.name.split(" ");
					return "https://en.wikipedia.org/wiki/" + full_name[0] + "_" + full_name[1];
				} else {
					return "";
				}
			};

			var artistsRef = new Firebase($rootScope.firebaseUri + "/artists/" + $routeParams.artist);
			$scope.viewModel = {bio: {}};
			$scope.viewModel.spinner = true;
			$scope.updatedMessage = {"status": false, "msg": ""};
			$scope.editModeEnabled = false;
			artistsRef.on("value", function (data) {
				var retrivedArtistData = data.val();
				if (retrivedArtistData !== null)
				{
					$scope.viewModel.name = retrivedArtistData.name;
					$scope.viewModel.bio.title = $sce.trustAsHtml("<span>" + urlify(retrivedArtistData.bio.title) + "</span>");
					$scope.viewModel.bio.body = $sce.trustAsHtml("<span>" + urlify(retrivedArtistData.bio.body) + "</span>");
					$scope.viewModel.skinName = retrivedArtistData.skinName;
					$scope.viewModel.language = retrivedArtistData.language;
					$scope.viewModel.region = retrivedArtistData.region;
					$scope.viewModel.dreaming = retrivedArtistData.dreaming;
					$scope.viewModel.DOB = retrivedArtistData.DOB;
					$scope.viewModel.bio.AASDLink = retrivedArtistData.bio.AASDLink;
					$scope.viewModel.bio.WikiLink = retrivedArtistData.bio.WikiLink;
					$scope.viewModel.AASDLinkFound = false;
					$scope.viewModel.realAASDLink = $scope.getAASDLink(retrivedArtistData);
					$scope.viewModel.wikiLinkFound = false;
					$scope.viewModel.realWikiLink = $scope.getWikiLink(retrivedArtistData);

					$scope.editModel = angular.copy($scope.viewModel);
					$scope.editModel.bio.title = retrivedArtistData.bio.title;
					$scope.editModel.bio.body = retrivedArtistData.bio.body;

					$http({method: "GET", url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + $scope.viewModel.realAASDLink + "%22&format=json"})
						.then(function (response) {
							if (response.data.query.results)
							{
								$scope.viewModel.AASDLinkFound = true;
							}
						});

					$http({method: "GET", url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + $scope.viewModel.realWikiLink + "%22&format=json"})
						.then(function (response) {
							if (response.data.query.results)
							{
								$scope.viewModel.wikiLinkFound = true;
							}
						});


				} else {
					$scope.updatedMessage = {status: true, msg: "No data available"};
				}
				$scope.viewModel.spinner = false;
				if (!$scope.$$phase) {
					console.log($scope.viewModel);
					$scope.$apply($scope.viewModel);
				}
			}, function (errObj) {
				console.log("error occurd " + errObj);
				$scope.updatedMessage.status = true;
				$scope.updatedMessage.msg = "Something went wrong. Cannot load data";
			});

			$scope.saveTitleAndBody = function (obj)
			{
				function ifIsNullOrEmpty(value)
				{
					if (value || typeof value !== "undefined")
					{
						return value;
					}

					return "";
				}

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

				updateArtistsBioRef.child('title').set(ifIsNullOrEmpty(obj.bio.title), onComplete);
				updateArtistsBioRef.child('body').set(ifIsNullOrEmpty(obj.bio.body), onComplete);
				updateArtistsBioRef.child('AASDLink').set(ifIsNullOrEmpty(obj.bio.AASDLink), onComplete);
				updateArtistsBioRef.child('WikiLink').set(ifIsNullOrEmpty(obj.bio.WikiLink), onComplete);

				$scope.viewModel.bio.title = $sce.trustAsHtml("<span>" + urlify(obj.bio.title) + "</span>");
				$scope.viewModel.bio.body = $sce.trustAsHtml("<span>" + urlify(obj.bio.body) + "</span>");
			};
		}]);
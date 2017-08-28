'use strict';
/**
 * @memberof artApp
 * @class artApp.add
 * @description Controller for add.
 */
angular.module('artApp.add', ['ngRoute', 'ngFileUpload', 'firebase'])

	.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/add', {
				templateUrl: 'view3/add.html',
				controller: 'addCtrl'
			});
		}])

	.controller('addCtrl', ['$scope', '$rootScope', 'Upload', '$routeParams', '$http', '$q', '$timeout', '$firebaseObject', '$filter', 'IsAuthorizedService',
		function ($scope, $rootScope, Upload, $routeParams, $http, $q, $timeout, $firebaseObject, $filter, IsAuthorizedService) {
			var viewModel = this;
			// this is the argument passed in by the ng-route as configured in the app.js

			IsAuthorizedService.checkAuth("upload-and-backup-artworks")
				.then(function (response) {
					$rootScope.permissions["upload-and-backup-artworks"] = true;
				}, function (error) {
					$rootScope.permissions["upload-and-backup-artworks"] = false;
				});

			$scope.isBackupSuccess = false;
			$scope.showBackupProcessing = false;
			viewModel.PhotoRefNo = $routeParams.PhotoRefNo;
			viewModel.paintings = [];
			$scope.fields = [];
			$scope.lastUpdatedDate;

			$http.get('/get-meta/last-update').then((response) => {
				$scope.lastUpdatedDate = response.data.value;
			})

			$scope.getFromFirebase = function ()
			{
				$scope.showBackupProcessing = true;
				var newJsonArray = [];
				var uploadedArtworksRef = new Firebase($rootScope.firebaseUri);
				uploadedArtworksRef.once("value", function (data) {
					var retrivedData = data.val();
					for (var key in retrivedData) {
						newJsonArray.push(retrivedData[key]);
					}

					var stringifiedArray = JSON.stringify(newJsonArray);

					var array = new FormData();
					array.append('fetched_data', stringifiedArray);
					$http.post('/save-from-firebase', array, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}).then(function (response) {
						$scope.showBackupProcessing = false;
						$scope.isBackupSuccess = true;
					}, function (error) {
						console.log(error);
					});

				});
			};

			function saveArtistsToFireBase(uniqueArtistsArray)
			{
				var d = $q.defer();
				var x = 0;

				var loopArray = function (uniqueArtistsArray) {
					saveOrDiscard(uniqueArtistsArray[x], function () {
						x++;
						if (x < uniqueArtistsArray.length) {
							loopArray(uniqueArtistsArray);
						}
					});
				};

				loopArray(uniqueArtistsArray);

				function saveOrDiscard(artistName, callback) {
					if (artistName)
					{
						var formattedArtistName = artistName.replace(/[$#,.]/g, "");

						var data = {
							"name": formattedArtistName,
							"skinName": "",
							"language": "",
							"region": "",
							"dreaming": "",
							"DOB": "",
							"bio": {
								"title": "",
								"body": "",
								"AASDLink": "",
								"WikiLink": ""
							},
						}
						$http.post('/save-artist', data).then(function () {
							d.resolve();
						});
						callback();
						return d.promise;
					}

				}
			}

			function saveSingleArtwork(data, imageFile) {
				var d = $q.defer();

				var img = new Image;

				img.src = imageFile;
				img.onload = function () {
					var newDataUri = imageToDataUri(img, 60, 60);
					data.thumbnail = newDataUri;

					$http.post('/save-artworks', data).then(function () {
						d.resolve();
					});

					return d.promise;
				}
			}

			function saveImage(data) {
				var d = $q.defer();

				$http.post('/save-image', data).then(function () {
					d.resolve();
				});

				return d.promise;
			}

			function imageToDataUri(img, width, height) {
				// create an off-screen canvas
				var canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');

				// set its dimension to target size
				canvas.width = width;
				canvas.height = height;

				// draw source image into the off-screen canvas:
				ctx.drawImage(img, 0, 0, width, height);

				// encode image to data-uri with base64 version of compressed image
				return canvas.toDataURL();
			}

			$scope.uploadFiles = function (file, errFiles) {
				$scope.f = file;
				$scope.showStartedToProcess = false;
				$scope.errFile = errFiles && errFiles[0];
				$scope.errors = [];
				if (file) {
					file.upload = Upload.upload({
						url: '/upload',
						data: {file: file}
					});

					file.upload.then(function (response) {
						console.log(response);
						var responseData = response.data;
						$scope.lastUpdatedDate = responseData.update_at;
						$scope.isBackupSuccess = false;
						file.result = response.data;
						$scope.showStartedToProcess = false;

					}, function (response) {
						$scope.showStartedToProcess = false;
						$scope.errors = response.data;
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
						if (file.progress == 100)
						{
							$scope.showStartedToProcess = true;
						}
					});
				}
			}

			// add a new item if there is no id passed in
			if (!viewModel.PhotoRefNo) {
				console.log('no id passed in');
				var artistInput = {};
				artistInput.placeholder = 'artist';
				artistInput.isRequired = true;
				artistInput.type = 'input';
				var titleInput = {};
				titleInput.placeholder = 'title';
				titleInput.isRequired = true;
				titleInput.type = 'input';
				var mediaInput = {};
				mediaInput.placeholder = 'media';
				mediaInput.isRequired = true;
				mediaInput.type = 'input';
				var idInput = {};
				idInput.placeholder = 'id';
				idInput.isRequired = true;
				idInput.type = 'input';
				$scope.fields.push(artistInput);
				$scope.fields.push(titleInput);
				$scope.fields.push(mediaInput);
				$scope.fields.push(idInput);
			} else {
				// load the artists file
				$http.get('data/artists.json').success(function (data) {
					viewModel.paintings = data;
					// iterate over the list to find the right piece
					for (var i = 0; i < viewModel.paintings.length; i++) {
						var obj = viewModel.paintings[i];
						// iterate over each property of the piece
						for (var key in obj) {
							var attrName = key;
							var attrValue = obj[key];
							// compare the property with the argument passed to the controller
							if (attrValue == viewModel.PhotoRefNo) {
								// when found set the view model with the properties
								viewModel.artist = obj.Artist;
								viewModel.title = obj.Title;

								viewModel.media = obj.Item;
								viewModel.id = obj.PhotoRefNo;
								var artistInput;
								artistInput.placeholder = attrValue;
								artistInput.isRequired = true;
								artistInput.type = 'input';
								var titleInput;
								titleInput.placeholder = attrValue;
								titleInput.isRequired = true;
								titleInput.type = 'input';
								var mediaInput;
								mediaInput.placeholder = attrValue;
								mediaInput.isRequired = true;
								mediaInput.type = 'input';
								var idInput;
								idInput.placeholder = attrValue;
								idInput.isRequired = true;
								idInput.type = 'input';
								fields.push(artistInput);
								fields.push(titleInput);
								fields.push(mediaInput);
								fields.push(idInput);
								break;
							}
						}
					}
				});
			}

			$scope.submitForm = function () {
				alert("under construction");
			};

			$scope.downloadBackup = function () {
				$scope.fileGenerating = true;
				$http.get('/download-backup').success(function (data) {
					var fileName = 'artwork-backup-' + $filter('date')(Date.now(), 'yyyy-MM-dd-HHmmss') + '.docx';
					var downloadLink = angular.element('<a></a>');
					downloadLink.attr('href', data.data);
					downloadLink.attr('download', fileName);
					downloadLink[0].click();
					$scope.fileGenerating = false;
				});
			};
		}]);

'use strict';
/**
 * @memberof artApp
 * @class artApp.view3
 * @description Controller for view 3.
 */
angular.module('artApp.view3', ['ngRoute', 'ngFileUpload'])

	.controller('View3Ctrl', ['$rootScope', '$scope', 'Upload', '$routeParams', '$http', 'InspectionsFactory',
		function ($rootScope, $scope, Upload, $routeParams, $http, InspectionsFactory) {

			$scope.viewModel = {};
			var paintingNo = parseInt($routeParams.paintingNo);
			$scope.viewModel.currentPaintingNumber = paintingNo;
			$scope.viewModel.prevPaintingNumber = paintingNo - 1;

			$scope.viewModel.nextPaintingNumber = parseInt(paintingNo) + 1;
			$scope.viewModel.imageFile = 'assets/images/spinner.gif';
			$scope.viewModel.thumbnail = 'assets/images/spinner.gif';

			$http.get('/get-artwork/' + paintingNo).then(function (res) {
				var retriveData = res.data;
				console.log(retriveData);
				$scope.viewModel.artist = retriveData.artist;
				$scope.viewModel.title = retriveData.title;
				$scope.viewModel.size = retriveData.size;
				$scope.viewModel.imageFileName = retriveData.imageFileName;
				$scope.viewModel.thumbnail = retriveData.thumbnail;

				$scope.viewModel.id = retriveData.assetRefNo;

				if ($rootScope.inspectionOn) {
					InspectionsFactory.addInspection(paintingNo);
				}

				if (!$scope.$$phase) {
					$scope.$apply($scope.viewModel);
				}

			}, function (errorObject) {
				console.log("read failed" + errorObject.code);
			});

			$scope.openLightBox = function ()
			{
				$http.get('/get-image/' + paintingNo).then(function (res) {
					var data = res.data;
					document.getElementById("view3-lightbox-image").src = data.imageFile;
					document.getElementById("view3-lightbox").style.display = "block";
				});
			};

			$scope.closeLightBox = function ()
			{
				document.getElementById("view3-lightbox").style.display = "none";
			}

			$scope.uploadAdditionalImages = function (files) {
				$scope.f = files;

				if ((files && files.length) || $scope.text) {
					files.upload = Upload.upload({
						url: '/add-additional-artwork-data',
						arrayKey: '',
						data: {text: $scope.text, asset_ref_no: $scope.viewModel.id, files: files}
					});

					files.upload.then(function (response) {
						$timeout(function () {
							files.result = response.data;
						});
					}, function (response) {
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}, function (evt) {
						files.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
					});
				}
			}
		}]);

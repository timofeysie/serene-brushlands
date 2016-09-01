'use strict';
/**
 * @memberof artApp
 * @class artApp.view3
 * @description Controller for view 3.
 */
angular.module('artApp.view3', ['ngRoute', 'ngFileUpload', 'firebase'])

	.controller('View3Ctrl', ['$rootScope', '$scope', 'Upload', '$routeParams', '$http', 'InspectionsFactory', '$firebaseObject',
		function ($rootScope, $scope, Upload, $routeParams, $http, InspectionsFactory, $firebaseObject) {

			$scope.viewModel = {};
			var paintingNo = parseInt($routeParams.paintingNo);
			$scope.viewModel.currentPaintingNumber = paintingNo;
			$scope.viewModel.prevPaintingNumber = paintingNo - 1;

			$scope.viewModel.nextPaintingNumber = paintingNo + 1;
			
			$scope.viewModel.nextPaintingNumber = parseInt(paintingNo) + 1;
			$scope.viewModel.imageFile = 'assets/images/spinner.gif';
			var uploadedArtworksRef = new Firebase($rootScope.firebaseUri + "/uploaded-artworks/" + paintingNo);

			uploadedArtworksRef.on("value", function (data) {

				var retriveData = data.val();
				$scope.viewModel.artist = retriveData.artist;
				$scope.viewModel.title = retriveData.title;
				$scope.viewModel.size = retriveData.size;
				$scope.viewModel.imageFileName = retriveData.imageFileName;
				$scope.viewModel.imageFile = retriveData.imageFile;
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

'use strict';
/**
 * @memberof artApp
 * @class artApp.View1
 * @description Controller for view 1.
 */
angular.module('artApp.view1', ['ngRoute', 'firebase'])

	.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/view1', {
				templateUrl: 'view1/view1.html',
				controller: 'View1Ctrl'
			});
		}])

	.controller('View1Ctrl', ['$scope', '$firebaseObject', '$http', '$rootScope', '$location', '$anchorScroll', function ($scope, $firebase, $http, $rootScope, $location, $anchorScroll) {

			$rootScope.$on('$routeChangeStart', function (ev, to, toParams, from, fromParams) {
				if (typeof toParams.params.paintingNo !== "undefined") {
					$location.hash(toParams.params.paintingNo);
					$anchorScroll();
				}
			});


			$scope.viewModel = {};
			$scope.viewModel.errorMessage = {status: false, message: ""};
			$scope.viewModel.paintings = [];

			if ($scope.viewModel.paintings.length == 0) {

				$scope.viewModel.spinner = true;
				$http.get('/get-artworks').then(function(res){
					var retriveData = res.data;
					for (var key in retriveData) {
						$scope.viewModel.paintings.push(retriveData[key]);
					}

					$scope.viewModel.spinner = false;
					if (!$scope.$$phase) {
						$scope.$apply($scope.viewModel);
					}

				}, function (errorObject) {
					console.log("read failed" + errorObject.code);
					$scope.viewModel.errorMessage = {status: true, message: "Please upload artwork data."};
					$scope.viewModel.spinner = false;
				});
				$scope.viewModel.errorMessage = {status: false, message: ""};
			} else {
				$scope.viewModel.spinner = false;
			}

			$rootScope.artworks = $scope.viewModel.paintings;
		}]);
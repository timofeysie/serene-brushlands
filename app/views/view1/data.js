'use strict';
/**
 * @memberof artApp
 * @class data.DataCtrl
 * @description Controller for data.
 */
/**
 [{	"count":1,
 "artist":"Artist: Betty Mbitjana",
 "title":"",
 "size":"",
 "amountPaid":"",
 "insured":"Insured: ",
 "supplier":"Independent\nArt Auctioneers - Inv IAA005461, 14 June 2010  – Lot 24",
 "officeLocation":""}]
 
 { PhotoRefNo: 149,
 Artist: 'Laurie Gowanulli',
 Title: '"Windjagen"',
 Item: '',
 'Office Loation': '',
 'Amount Paid': '',
 Insured: '',
 Supplier: '' }
 */
angular.module('artApp.data', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/data', {
				templateUrl: 'view1/data.html',
				controller: 'DataCtrl'
			});
		}])

	.controller('DataCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
			$scope.viewModel = {};
			// table sorting
			$scope.viewModel.sortType = 'name'; // set the default sort type
			$scope.viewModel.sortReverse = false;  // set the default sort order
			$scope.viewModel.officeLocation = '';     // set the default search/filter term
			$scope.viewModel.artworks = [];

			var uploadedArtworksRef = new Firebase($rootScope.firebaseUri + "/uploaded-artworks");
			uploadedArtworksRef.on("value", function (data) {
				var retriveData = data.val();

				for (var key in retriveData) {
					$scope.viewModel.artworks.push(retriveData[key]);
				}

				if (!$scope.$$phase) {
					$scope.$apply($scope.viewModel);
				}

			}, function (errorObject) {
				console.log("read failed" + errorObject.code);
			});

			// var sample = {
			//   'amountPaid': '$111,000',
			//   'artist': 'Malaluba Gumana 2',
			//   'count': 207,
			//   'insured': '',
			//   'officeLocation': 'St Leonards Office –Kitchen',
			//   'size': '195 x 27 cm diameter',
			//   'supplier': 'Annandale Galleries – Invoice 3848, 19 August 2015',
			//   'title': 'Garrimala, 2015'
			// }

			// viewModel.artworks.push(smaple);
		}]);

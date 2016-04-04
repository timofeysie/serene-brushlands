'use strict';
/**
 * @memberof myApp
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
angular.module('myApp.data', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/data', {
    templateUrl: 'view1/data.html',
    controller: 'DataCtrl'
  });
}])

.controller('DataCtrl', ['$scope', '$http', function($scope, $http) {
	var viewModel = this;
  // table sorting
  viewModel.sortType     = 'name'; // set the default sort type
  viewModel.sortReverse  = false;  // set the default sort order
  viewModel.officeLocation   = '';     // set the default search/filter term

  	$http.get('/artworks').success(function(data) {
  		for (var i = 0;i<data.length;i++) {
  			var item = data[i];
        console.log(i+' - ',item);
  		}
      viewModel.artworks = data;
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

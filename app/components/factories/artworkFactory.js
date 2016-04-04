'use strict';
var app = angular.module('myApp');
	app.factory('ArtowkFactory', ['$http', 
	function ($http) {  
		var getArtworks = function() {
			$http.get('/word').success(function(data) {
				return data;
  			});
		};
		return {
			getArtworks:  getArtworks,
		}
	}]);

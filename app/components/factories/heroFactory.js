function() {
	'use strict';
	var app = angular.module('myApp');
	app.factory('HeroFactory', HeroFactory);
	HeroFactory.$inject=['$http', '$timeout', '$q', '$log'];
	function HeroFactory($http, $timeout, $q, $log) {
		return {
			getCSV: getCSV,
			getHTML: getHTML
		};
		
		function getCSV() {
			return $http.get('/data/csv.json')
				.then(getSuccess)
				.catch(getFailure);
			function getSuccess(res) {
				return res.data;
			}
			function getFailure(res) {
				$log.error(res);
				return $q.reject('Unable to fetch from file.');
			}
		}
		function getHTML() {
			return $http.get('/data/sample.json')
				.then(getSuccess)
				.catch(getFailure);		
			function getSuccess(res) {
				return res.data;
			}
			function getFailure(res) {
				$log.error(res);
				return $q.reject('Unable to fetch from file.');
			}
		}
	};
	}
}();
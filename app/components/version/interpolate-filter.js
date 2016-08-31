'use strict';

angular.module('artApp.version.interpolate-filter', [])

	.filter('interpolate', ['version', function (version) {
			return function (text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}]);

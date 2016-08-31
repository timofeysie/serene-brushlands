'use strict';

angular.module('artApp.version', [
	'artApp.version.interpolate-filter',
	'artApp.version.version-directive'
])

	.value('version', '0.1');

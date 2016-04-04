'use strict';
describe('LocationsCtrl.locations', function(){
	beforeEach(module('myApp.locations'));
	describe('get /sample result', function(){
		it('should be added to scope', inject(function($rootScope, 
				$controller, 
				$httpBackend) {
			var scope = $rootScope;
			$httpBackend
				.when('GET', '/sample')
				.respond([
					'Adelaide Training Room', '428 Edgecliff Road', 'Brisbane Office'
				]);
			var LocationsCtrl = $controller('LocationsCtrl', {$scope: scope});
			$httpBackend.flush();
			LocationsCtrl.artworks.should.contain('Brisbane Office');
		}));
	});
});

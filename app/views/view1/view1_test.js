'use strict';
describe('View1Ctrl', function(){
	beforeEach(module('artApp.view1'));
	describe('get data/artists result', function(){
		it('should be added to scope', inject(function($rootScope, 
				$controller, 
				$httpBackend) {
			var scope = $rootScope;
			$httpBackend
				.when('GET', 'data/artists.json')
				.respond([
					'Abie Loy Kemarre', 'Alan Griffiths', 'Albert Namatjira'
				]);
			var View1Ctrl = $controller('View1Ctrl', {$scope: scope});
			$httpBackend.flush();
			View1Ctrl.paintings.should.contain('Albert Namatjira');
		}));
	});
});

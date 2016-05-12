// 'use strict';
// ReferenceError: Strict mode forbids implicit creation of global property 'authRequestHandler'
describe('DataCtrl', function() {
	var $httpBackend, $rootScope, createController;
	beforeEach(module('artApp.data'));
	beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     // backend definition common for all tests
     authRequestHandler = $httpBackend.when('GET', '/auth.py')
                            .respond({userId: 'userX'}, {'A-Token': 'xxx'});
     // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');
     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');
     createController = function() {
       return $controller('DataCtrl', {'$scope' : $rootScope });
     };
   	}));

	describe('sort type should default to name', function(){
		it('should be added to scope', inject(function($rootScope, 
				$controller) {
			var scope = $rootScope;
			var DataCtrl = $controller('DataCtrl', {$scope: scope});
			DataCtrl.sortType.should.contain('name');
		}));
	});
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
			var DataCtrl = $controller('DataCtrl', {$scope: scope});
			$httpBackend.flush();
			DataCtrl.sortType.should.contain('name');
		}));
	});
	afterEach(function() {
     	$httpBackend.verifyNoOutstandingRequest();
   	});

	describe('get /sample with error', function(){
		it('should have a status with error', inject(function($rootScope,
				$controller, 
				$httpBackend) {
			var scope = $rootScope;
			$httpBackend
				.when('GET', '/sample')
				.respond(500, '');
			var DataCtrl = $controller('DataCtrl', {$scope: scope});
			console.log($rootScope);
			$httpBackend.flush();
			scope.status.should.equal('ERROR');
		}));
		it('should fail authentication', function() {
		     $httpBackend.expectGET('/sample');
		     var controller = createController();
		     $httpBackend.flush();
		     expect($rootScope.status).toBe('Failed...');
   		});
	});
});

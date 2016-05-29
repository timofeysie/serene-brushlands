'use strict';

describe('View1Ctrl', function () {
	var view1Ctrl, $scope;

	beforeEach(module('artApp.view1'));

	beforeEach(inject(function ($controller, $rootScope) {
 		$scope = $rootScope.$new();
        view1Ctrl = $controller('View1Ctrl', {
 			$scope: $scope
 		});
 	}));
	
	it('should have a $scope variable', function () {
		expect($scope).toBeDefined();
	});

	it('should assign an error message object to the scope', function () {
		var messageObj = {status:false, message:''};
		expect(view1Ctrl.errorMessage).toEqual(messageObj);
	});

	it('should have a paintings array the scope', function () {
		var paintings = [];
		expect(view1Ctrl.paintings).toEqual(paintings);
		expect(view1Ctrl.paintings.length).toEqual(0);
		expect(view1Ctrl.spinner).toBe(true);
	});
    
   //  it('should set artwors via http', inject(function ($controller, $rootScope, $httpBackend) {
   //  	$scope = $rootScope.$new();
 		// $httpBackend.when('GET', 'artworks')
   //      	.respond([{things: 'and stuff'}]);
   //      $httpBackend.flush();
   //      view1Ctrl = $controller('View1Ctrl', {
 		// 	$scope: $scope
 		// });
 		// console.log('view1Ctrl.paintings',view1Ctrl.paintings);
   //    	expect(view1Ctrl.paintings)
   //    		.toEqual([{things: 'and stuff'}]);
   //  }));

});
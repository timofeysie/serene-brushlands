'use strict';

describe('View1Ctrl', function () {
	var view1Ctrl, $scope;
	beforeEach(module('artApp.view1'));

	beforeEach(inject(function ($controller, $rootScope) {
 		$scope = $rootScope.$new();
 		view1Ctrl = $controller('View1Ctrl', {
 			$scope: $scope
 		})
 	}));
	
	it('should have a $scope variable', inject(function () {
		expect($scope).toBeDefined();
	}));

	it('should assign an error message object to the scope', inject(function () {
		var messageObj = {status:false, message:''};
		expect(view1Ctrl.errorMessage).toEqual(messageObj);
	}));

	it('should have a paintings array the scope', inject(function () {
		var paintings = [];
		expect(view1Ctrl.paintings).toEqual(paintings);
		expect(view1Ctrl.paintings.length).toEqual(0);
		expect(view1Ctrl.spinner).toBe(true);
	}));

});
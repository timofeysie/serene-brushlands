'use strict';

describe('View1Ctrl', function () {
	var mainCtrl, $scope;
	beforeEach(module('artApp.view1'));

	beforeEach(inject(function ($controller, $rootScope) {
 		$scope = $rootScope.$new();
 		$controller('View1Ctrl', {
 			$scope: $scope
 		})
 	}));
	
	it('should have a $scope variable', inject(function ($controller, $rootScope) {
		expect($scope).toBeDefined();
	}));

	it('should assign an error message object to the scope', inject(function ($controller, $rootScope) {
		var messageObj = {status:false,message:""};
		console.log('scope',$scope);
		expect($scope.test).toEqual('testing');
		//expect($scope.errorMessage).toEqual(messageObj);
	}));

});
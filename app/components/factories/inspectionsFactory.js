'use strict';
/**
  * @function InspectionsFactory
  * @memberOf myApp
  * @description This is an angularjs factory to save and retrieve inpsection information from Firebase.
  */
var app = angular.module('myApp');
	app.factory('InspectionsFactory', ['$rootScope', '$http', '$q', '$firebaseObject', '$firebaseArray', 
	function ($rootScope, $http, $q, $firebaseObject, $firebaseArray) {
		var ref = new Firebase($rootScope.firebaseUri);
  		var inspections = $firebaseArray(new Firebase($rootScope.firebaseUri+'/inspections'));
  		var inspectionOn = false;
  		var itemId;
  		ref.on('value', function(snapshot) {
  			var data = snapshot.val();
  			for (var id in data) {
		    if (data.hasOwnProperty(id)) {
		        if (id === 'inspectionOn') {
		        	inspectionOn = data[id];
		        	itemId = id;
		        	$rootScope.inspectionOn = data[id];
		        }
		    }
		}    
		}, function (errorObject) {
		  	console.log("The read failed: " + errorObject.code);
		});
		var startInspection = function() {
			inspectionOn = true;
			$rootScope.inspectionOn = true;
			var obj = $firebaseObject(ref);
			obj.inspectionOn = true;
			obj.$save().then(function(ref) {
			  console.log('ref.key()',obj.$id); 
			}, function(error) {
			  console.log('Error:', error);
			});
		};
		var stopInspection = function() {
			inspectionOn = false;
			$rootScope.inspectionOn = false;
			var obj = $firebaseObject(ref);
			obj.inspectionOn = false;
			obj.$save().then(function(ref) {
			  console.log('ref.key()',obj.$id); 
			}, function(error) {
			  console.log('Error:', error);
			});
		};
		var inspecting = function() {
			return inspectionOn;
		};
		var getInspections = function() {
			return inspections;
		};
		var addInspection = function(assetRefNo) {
			  $http({
			    url: '/inspect', 
			    method: "GET",
			    params: {'assetRefNo': assetRefNo}
			  });
		};
		var getWordDoc = function(item) {
			var deferred = $q.defer();
			$http.get('word').success(function(data) {
				deferred.resolve(data);
  			});
  			return deferred.promise;
		};
		var updateInspection = function(id) {
			inspections.$save(id);
		} 
		var removeInspection = function (id) {
			inspections.$remove(id);
		};
		var getArtwork = function (assetRefNo) {
			var deferred = $q.defer();
			$http({
				    method: 'GET',
				    url: '/artwork',
				    params: {'assetRefNo': assetRefNo}
				}).success(function(data) {
				deferred.resolve(data);
  			});
  			return deferred.promise;
		};
		return {
			startInspection:  startInspection,
			stopInspection:   stopInspection,
			inspecting: 	  inspecting,
			getInspections:   getInspections,
			addInspection: 	  addInspection,
			updateInspection: updateInspection,
			removeInspection: removeInspection,
			getWordDoc: 	  getWordDoc,
			getArtwork:       getArtwork
		}
	}]);

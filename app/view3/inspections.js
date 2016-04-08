'use strict';
/**
 * @memberof myApp
 * @class inspections.InspectionsCtrl
 * @description Controller for inspections.
 */
angular.module('myApp.inspections', ['ngRoute', 'firebase'])

.controller('InspectionsCtrl', ['$rootScope', '$scope', '$http', 'InspectionsFactory',
  function($rootScope, $scope, $http, InspectionsFactory) {
  var viewModel = this;
  var data = InspectionsFactory.getWordDoc();
  viewModel.inspectedArtworks = [];
  
  $http.get('/get-inspected-artworks').success(function(data) {
    for (var i = 0;i<data.length;i++) {
      var item = data[i];
      if (item.inspected) {
        viewModel.inspectedArtworks.push(item);
      }
    }
  });
  viewModel.inspections = InspectionsFactory.getInspections();
  viewModel.isInspecting = $rootScope.inspectionOn;
  $scope.startNewInspection = function() {
    var now = new Date();
    var inspection = {date: now, checkedWorks: checkedWorks};
    //console.log('adding',inspection);
    InspectionsFactory.addInspection(angular.copy(inspection));
  };
  $scope.startInspection = function() {
    InspectionsFactory.startInspection();
    viewModel.isInspecting = InspectionsFactory.inspecting();
  };
  $scope.stopInspection = function() {
    InspectionsFactory.stopInspection();
    viewModel.isInspecting = InspectionsFactory.inspecting();
  };
  /** This will re-generate the data from the word document which contains no inspection data.*/
  $scope.resetInspection = function() {
    $http.get('/sample').success(function(data) {
    viewModel.inspectedArtworks = [];
    });
  };
}]);

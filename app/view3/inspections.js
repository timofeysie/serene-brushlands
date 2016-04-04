'use strict';
/**
 * @memberof myApp
 * @class inspections.InspectionsCtrl
 * @description Controller for inspections.
 */
angular.module('myApp.inspections', ['ngRoute', 'firebase'])

.controller('InspectionsCtrl', ['$rootScope', '$scope', '$http', 'InspectionsFactory',
  function($rootScope, $scope, $http, InspectionFactory) {
  var viewModel = this;
  var data = InspectionFactory.getWordDoc();
  viewModel.inspectedArtworks = [];
  
  $http.get('/get-inspected-artworks').success(function(data) {
    for (var i = 0;i<data.length;i++) {
      var item = data[i];
      if (item.inspected) {
        viewModel.inspectedArtworks.push(item);
      }
    }
  });
  viewModel.inspections = InspectionFactory.getInspections();
  viewModel.isInspecting = $rootScope.inspectionOn;
  $scope.startNewInspection = function() {
    var now = new Date();
    var inspection = {date: now, checkedWorks: checkedWorks};
    //console.log('adding',inspection);
    InspectionFactory.addInspection(angular.copy(inspection));
  };
  $scope.startInspection = function() {
    InspectionFactory.startInspection();
    viewModel.isInspecting = InspectionFactory.inspecting();
  };
  $scope.stopInspection = function() {
    InspectionFactory.stopInspection();
    viewModel.isInspecting = InspectionFactory.inspecting();
  };
  /** This will re-generate the data from the word document which contains no inspection data.*/
  $scope.resetInspection = function() {
    $http.get('/sample').success(function(data) {
    viewModel.inspectedArtworks = [];
    });
  };
}]);

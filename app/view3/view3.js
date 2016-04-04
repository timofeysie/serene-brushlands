'use strict';
/**
 * @memberof myApp
 * @class view3.View3Ctrl
 * @description Controller for view 3.
 */
angular.module('myApp.view3', ['ngRoute', 'ngFileUpload', 'firebase'])

.controller('View3Ctrl', ['$rootScope', '$scope', 'Upload', '$routeParams', '$http', 'InspectionsFactory', 
  function($rootScope, $scope, Upload, $routeParams, $http, InspectionFactory) {
  var viewModel = this;
  // this is the argument passed in by the ng-route as configured in the app.js
  var paintingNo = $routeParams.paintingNo;
  InspectionFactory.getArtwork(paintingNo)
  .then(function(response){
    viewModel.artist = response.artist;
    viewModel.title = response.title;
    viewModel.size = response.size;
    viewModel.imageFileName = response.imageFileName;
	viewModel.imageFile = response.imageFile;
    viewModel.id = response.assetRefNo;

    if ($rootScope.inspectionOn) {
      InspectionFactory.addInspection(paintingNo);
    }
  });
  
  $scope.uploadAdditionalImages = function(files) {
    $scope.f = files;
    
    if ((files && files.length) || $scope.text) {
        files.upload = Upload.upload({
            url: '/add-additional-artwork-data',
            arrayKey:'',
            data: {text:$scope.text,asset_ref_no:viewModel.id,files: files}
        });

        files.upload.then(function (response) {
            $timeout(function () {
                files.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            files.progress = Math.min(100, parseInt(100.0 * 
                                     evt.loaded / evt.total));
        });
    }   
}
}]);

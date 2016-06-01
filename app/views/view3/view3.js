'use strict';
/**
 * @memberof artApp
 * @class artApp.view3
 * @description Controller for view 3.
 */
angular.module('artApp.view3', ['ngRoute', 'ngFileUpload', 'firebase'])

.controller('View3Ctrl', ['$rootScope', '$scope', 'Upload', '$routeParams', '$http', 'InspectionsFactory', 
  function($rootScope, $scope, Upload, $routeParams, $http, InspectionsFactory) {
  var viewModel = this;
  // this is the argument passed in by the ng-route as configured in the app.js
  var paintingNo = $routeParams.paintingNo;
  InspectionsFactory.getArtwork(paintingNo)
  .then(function(response){
    viewModel.artist = response.artist;
    viewModel.title = response.title;
    viewModel.size = response.size;
    viewModel.imageFileName = response.imageFileName;
	viewModel.imageFile = response.imageFile;
    viewModel.id = response.assetRefNo;

    if ($rootScope.inspectionOn) {
      InspectionsFactory.addInspection(paintingNo);
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

'use strict';
/**
 * @memberof myApp
 * @class add.addCtrl
 * @description Controller for add.
 */
angular.module('myApp.add', ['ngRoute','ngFileUpload','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/add', {
    templateUrl: 'view3/add.html',
    controller: 'addCtrl'
  });
}])

.controller('addCtrl', ['$scope','$rootScope','Upload', '$routeParams', '$http','$timeout','$firebaseObject', 
  function($scope,$rootScope, Upload, $routeParams, $http, $timeout,$firebaseObject) {
  var viewModel = this;
  // this is the argument passed in by the ng-route as configured in the app.js
  $scope.isBackupSuccess = false;
  viewModel.PhotoRefNo = $routeParams.PhotoRefNo;
  viewModel.paintings = [];
  $scope.fields = [];
  
  $scope.getFromFirebase = function()
  {
    var newJsonArray = [];
    var uploadedArtworksRef =new Firebase($rootScope.firebaseUri+"/uploaded-artworks");
    uploadedArtworksRef.once("value", function(data) {
      var retrivedData = data.val();
      for (var key in retrivedData) {
        newJsonArray.push(retrivedData[key]);
      }
      
      var stringifiedArray = JSON.stringify(newJsonArray);
      
      var array = new FormData();
      array.append('fetched_data', stringifiedArray);
      $http.post('/save-from-firebase', array, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      }).then(function(response){
        $scope.isBackupSuccess = true;
      },function(error){
        console.log(error);
      });

    });
  };
  
  function saveArtistsToFireBase(uniqueArtistsArray)
  {
      var x = 0;

      var loopArray = function(uniqueArtistsArray) {
          saveOrDiscard(uniqueArtistsArray[x],function(){
              x++;
              if(x < uniqueArtistsArray.length) {
               	loopArray(uniqueArtistsArray);   
              }
          }); 
      }

      loopArray(uniqueArtistsArray);

      function saveOrDiscard(artistName,callback) {
        var artistsRef =new Firebase($rootScope.firebaseUri+"/artists/"+artistName);
        
        artistsRef.once("value",function(data){
          if(data.val() === null)
          {
            artistsRef.set(
              {
                "name":artistName,
                "skinName":"",
                "language":"",
                "region":"",
                "dreaming":"",
                "DOB":"",
                "bio":{
                  "title":"",
                  "body":"",
				  "AASDLink":"",
				  "WikiLink":""
                }
              }
            );
          }
        });
        callback();
    }
  }
  
  $scope.uploadFiles = function(file, errFiles) {
    $scope.f = file;
    $scope.errFile = errFiles && errFiles[0];
    if (file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: {file: file}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                var uniqueArtistsArray = [];
                
                for(var i=0;i<response.data.length;i++)
                {
                  var uploadedArtworksRef =new Firebase($rootScope.firebaseUri+"/uploaded-artworks/"+response.data[i].assetRefNo);
                  
                  if(uniqueArtistsArray.indexOf(response.data[i].artist) == -1)
                  {
                    uniqueArtistsArray.push(response.data[i].artist);
                  }
                  uploadedArtworksRef.set(response.data[i]);
                }
                
                $scope.isBackupSuccess = false;
                
                saveArtistsToFireBase(uniqueArtistsArray);
                
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * 
                                     evt.loaded / evt.total));
        });
    }   
}

  // add a new item if there is no id passed in
  if (!viewModel.PhotoRefNo) {
    console.log('no id passed in');
    var artistInput = {};
    artistInput.placeholder = 'artist';
    artistInput.isRequired = true;
    artistInput.type = 'input';
    var titleInput = {};
    titleInput.placeholder = 'title';
    titleInput.isRequired = true;
    titleInput.type = 'input';
    var mediaInput = {};
    mediaInput.placeholder = 'media';
    mediaInput.isRequired = true;
    mediaInput.type = 'input';
    var idInput = {};
    idInput.placeholder = 'id';
    idInput.isRequired = true;
    idInput.type = 'input';
    $scope.fields.push(artistInput);
    $scope.fields.push(titleInput);
    $scope.fields.push(mediaInput);
    $scope.fields.push(idInput);
  } else {
    // load the artists file
    $http.get('data/artists.json').success(function(data) {
      viewModel.paintings = data;
      // iterate over the list to find the right piece
      for (var i = 0; i < viewModel.paintings.length; i++) {
          var obj = viewModel.paintings[i];
          // iterate over each property of the piece
          for (var key in obj) {
              var attrName = key;
              var attrValue = obj[key];
              // compare the property with the argument passed to the controller
              if (attrValue == viewModel.PhotoRefNo) {
                // when found set the view model with the properties
                viewModel.artist = obj.Artist;
                viewModel.title = obj.Title;
                
                viewModel.media = obj.Item;
                viewModel.id = obj.PhotoRefNo;
                var artistInput;
                artistInput.placeholder = attrValue;
                artistInput.isRequired = true;
                artistInput.type = 'input';
                var titleInput;
                titleInput.placeholder = attrValue;
                titleInput.isRequired = true;
                titleInput.type = 'input';
                var mediaInput;
                mediaInput.placeholder = attrValue;
                mediaInput.isRequired = true;
                mediaInput.type = 'input';
                var idInput;
                idInput.placeholder = attrValue;
                idInput.isRequired = true;
                idInput.type = 'input';
                fields.push(artistInput);
                fields.push(titleInput);
                fields.push(mediaInput);
                fields.push(idInput);
                break;
              }
          }
      }
    });
  }

  $scope.submitForm = function() {
    alert("under construction");
  };
}]);

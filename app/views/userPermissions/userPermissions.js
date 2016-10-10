'use strict';
/**
 * @memberof artApp.locations
 * @class locations.LocationsCtrl
 * @description Controller for locations.
 */
angular.module('artApp.userPermissions', [])

	.controller('UserPermissionsCtrl', ['$rootScope', '$scope', '$http', 'IsAuthorizedService',
		function ($rootScope, $scope, $http, IsAuthorizedService) {

			$scope.currentSelectedUser = "";
			$scope.permissionsCheckboxes = {};

			IsAuthorizedService.checkAuth("manage-user-permissions")
				.then(function (response) {
					$rootScope.permissions["manage-user-permissions"] = true;
				}, function (error) {
					$rootScope.permissions["manage-user-permissions"] = false;
				});

			function getUserPermissions()
			{
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function (data) {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						var response = xhttp.responseText;
						$scope.permissionsFile = JSON.parse(response);
						$scope.assignedPermissions = JSON.parse(response).assignedPermissions;
						$scope.permissions = Object.keys($scope.assignedPermissions);
						$scope.users = JSON.parse(response).users;
					}
				};
				xhttp.open("GET", "/auth-roles", true);
				xhttp.send();
			}

			$scope.setDefaultCheck = function (permission)
			{
				if ($scope.assignedPermissions[permission].indexOf($scope.currentSelectedUser) !== -1)
				{
					return true;
				}

				return false;
			}

			$scope.setUserPermissions = function (permission, checkBox)
			{
				var userIndex = $scope.assignedPermissions[permission].indexOf($scope.currentSelectedUser);
				if ($scope.permissionsCheckboxes[checkBox])
				{
					if (userIndex == -1)
					{
						$scope.assignedPermissions[permission].push($scope.currentSelectedUser);
					}
				} else {
					if (userIndex > -1)
					{
						$scope.assignedPermissions[permission].splice(userIndex, 1);
					}
				}
			}

			getUserPermissions();

			$scope.saveUserPermissions = function ()
			{
				var array = new FormData();
				$scope.permissionsFile["assignedPermissions"] = $scope.assignedPermissions;

				array.append('fetched_data', JSON.stringify($scope.permissionsFile));

				if ($scope.permissionsFile["assignedPermissions"]["manage-user-permissions"].length == 0)
				{
					alert("Please assign at least one user for user management");
				} else {
					$http.post('/save-user-permissions', array, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}).then(function (response) {
						alert("Saved Successfully");
						location.reload();
					}, function (error) {
						alert("Something Went Wrong");
					});
				}

			}
		}]);

'use strict';
/**
 * @memberof artApp.locations
 * @class locations.LocationsCtrl
 * @description Controller for locations.
 */
angular.module('artApp.userPermissions', [])

	.controller('UserPermissionsCtrl', ['$scope', '$window', '$location', '$http', '$rootScope', 'AclService',
		function ($scope, $window, $location, $http, $rootScope, AclService) {
			$scope.roles = [];
			$scope.userRoles = {};

			var roleBasedPermissions = JSON.parse(document.getElementById('role-permissions').value);

			$scope.roles = roleBasedPermissions.userRoles;

			$scope.roleBasedPermissions = roleBasedPermissions;

			$scope.setDefaultCheck = function (role, alreadySetRole)
			{
				if (alreadySetRole == role)
				{
					return true;
				}

				return false;
			}

			$scope.saveUserRoles = function ()
			{
				angular.forEach($scope.userRoles, function (role, email) {
					$scope.roleBasedPermissions[email] = [role];
				});

				var isAtleastOneAdminAvailable = false;

				var keepGoing = true;

				angular.forEach($scope.roleBasedPermissions, function (role) {
					if (keepGoing) {
						if (role == "admin") {
							isAtleastOneAdminAvailable = true;
							keepGoing = false;
						}
					}
				});

				if (isAtleastOneAdminAvailable)
				{
					var profile = JSON.parse(localStorage.getItem('profile'));

					function save()
					{
						var array = new FormData();
						array.append('fetched_data', JSON.stringify($scope.roleBasedPermissions));

						$http.post('/save-user-roles', array, {
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						}).then(function (response) {

							var xhttp = new XMLHttpRequest();
							xhttp.onreadystatechange = function (data) {
								if (xhttp.readyState == 4 && xhttp.status == 200) {
									var response = xhttp.responseText;
									document.getElementById('role-permissions').value = response;

									var roleBasedPermissions = document.getElementById('role-permissions').value;

									delete roleBasedPermissions.userRoles;

									var aclData = JSON.parse(roleBasedPermissions);

									AclService.setAbilities(aclData);

									alert("Successfully Changed User Permissions");

									if (r == true)
									{
										$scope.$apply(function () {
											$location.path('/');
										});
									}
								}
							};
							xhttp.open("GET", "/auth-roles", true);
							xhttp.send();
						}, function (error) {
							alert("Something Went Wrong");
						});
					}

					if ($scope.roleBasedPermissions[profile.email][0] !== "admin")
					{
						var r = confirm("Are you sure to remove current user from admins ?");

						if (r == true) {
							save();
						}
					} else {
						save();
					}
				} else {
					alert("Please select at least one admin");
				}
			}
		}]);

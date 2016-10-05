'use strict';

angular.module('artApp.isAuthorized', [])
	.directive('isAuthorized', function ($http) {
		function link(scope, element) {
			var array = new FormData();

			var loggedUser = localStorage.getItem('profile');
			var currentUserEmail = null;

			if (loggedUser)
			{
				currentUserEmail = JSON.parse(loggedUser).email;
			}

			array.append('fetched_data', JSON.stringify({email: currentUserEmail, task: scope.authorizedTask}));

			$http.post('/is-authorized', array, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function (response) {
				console.log("Authorized");
			}, function (error) {
				element.addClass('unauthorized');
			});
		}

		return {
			link: link,
			scope: {
				authorizedTask: "@authorizedTask"
			}
		};
	});

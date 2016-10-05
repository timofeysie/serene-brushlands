angular.module('artApp')
	.factory('IsAuthorizedService', ["$http", function ($http) {
			return {
				checkAuth: function (task) {
					var array = new FormData();

					var loggedUser = localStorage.getItem('profile');
					var currentUserEmail = null;

					if (loggedUser)
					{
						currentUserEmail = JSON.parse(loggedUser).email;
					}

					array.append('fetched_data', JSON.stringify({email: currentUserEmail, task: task}));

					return $http.post('/is-authorized', array, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					});
				}
			};
		}]);
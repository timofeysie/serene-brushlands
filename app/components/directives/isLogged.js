'use strict';

angular.module('artApp.directives', [])
	.directive('isLogged', function ($window) {
		return {
			restrict: 'A',
			scope: {
				ifLogged: "@"
			},
			link: function (scope, element) {

				var token = localStorage.getItem('token');
				
				if (token)
				{
					if (scope.ifLogged == 'show')
					{
						element.show();
					} else if (scope.ifLogged == 'hide')
					{
						element.remove();
					}

				} else
				{
					if (scope.ifLogged == 'show')
					{
						element.remove();
					} else if (scope.ifLogged == 'hide')
					{
						element.show();
					}
				}
			}
		};
	});
'use strict';



/**
 * Directive: Ripple Effect
 */
app.directive('ripple', [
	'$timeout',

	function($timeout) {
		return {
			controller: 'rippleCtrl',
			restrict: 'A',

			compile: function compile(tElement, tAttrs, transclude) {
				return {
					pre: function preLink(scope, iElement, iAttrs, controller) {
						var container = $('<div/>').addClass('ripple-container'),
							elementHeight = iElement.height();

						console.log('iElement', iElement);
						// get it ready to go once
						iElement.css('position', 'relative');

						// Add the element
						container.appendTo(iElement);

						// Store our elements for easy access
						scope.container = container;
						scope.ripple = $('<div/>');

						scope.ripple.addClass('ripple-effect');
						scope.ripple.appendTo(scope.container);
					},

					post: function postLink(scope, iElement, iAttrs, controller) {
						$timeout(function() {
							scope.height = iElement.height();
						});
					}
				};
			},

			scope: {
				rippleColor: '@',
				rippleDisabled: '@'
			}
		};
	}
]);

/**
 * Controller: Handle the Polymer Ripple effect on any element
 */
app.controller('rippleCtrl', [
	'$scope',
	'$element',
	'$transition',
	'$timeout',

	function($scope, $element, $transition, $timeout) {



		// Ripple effect occurs on click
		$element.bind('click', function(ev) {
			if ($scope.isAnimating) {
				return;
			}

			$scope.ripple.removeClass('ripple-animation');
			$scope.ripple.addClass('ripple-animation');
			$scope.isAnimating = true;

			// get touch coordinates
			var endCoords = ev,
				touchX = endCoords.pageX - $scope.container.offset().left,
				touchY = endCoords.pageY - $scope.container.offset().top;

			// Set the position to the touch co-ords.
			$scope.ripple.css({
				left: touchX - ($scope.height / 2),
				top: touchY - ($scope.height / 2),
			});

			// animate by adding "ripple-animation on" classes then remove the ripple-effect element when complete
			$transition($scope.ripple, 'on').then(function() {
				$scope.ripple.removeClass('ripple-animation on');
				$scope.isAnimating = false;
			});

			// Fallback to ensure the class(es) have been removed
			$timeout(function() {
				$scope.ripple.removeClass('ripple-animation on');
				$scope.isAnimating = false;
			}, 200);
		});

		// Add the actual element that will animate to the container
		$timeout(function() {
			$scope.ripple.css({
				background: $scope.rippleColor,
				height: $scope.height,
				width: $scope.height
			});
		}, 50);
	}
]);

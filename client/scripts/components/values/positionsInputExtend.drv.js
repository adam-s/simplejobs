(function() {
    angular.module('simplejobs')
        .directive('positionsInputExtend', positionsInputExtend);

    positionsInputExtend.$inject = ['$window'];

    function positionsInputExtend($window) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ctrl) {

                scope.positions = angular.copy($window.values.positions);
                scope.positions.unshift('All positions');

                ctrl.$render = function (){
                    scope.position = ctrl.$viewValue;
                };

                ctrl.$parsers.push(function(viewValue) {
                    return viewValue === 'All positions' ? null : viewValue;
                });
            }
        }
    }
})();
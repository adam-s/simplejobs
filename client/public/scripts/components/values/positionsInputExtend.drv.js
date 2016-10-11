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
                if (!attrs.required) scope.positions.unshift('Any position');

                ctrl.$parsers.push(function(viewValue) {
                    return viewValue === 'Any position' ? null : viewValue;
                });
            }
        }
    }
})();
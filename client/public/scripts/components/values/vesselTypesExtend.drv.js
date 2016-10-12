(function() {
    angular.module('simplejobs')
        .directive('vesselTypesExtend', vesselTypesExtend);

    vesselTypesExtend.$inject = ['$window'];

    function vesselTypesExtend($window) {

        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ctrl) {
                scope.vesselTypes = angular.copy($window.values.vesselTypes);
                if (!attrs.required) scope.vesselTypes.unshift('Any type');

                ctrl.$parsers.push(function(viewValue) {
                    return viewValue === 'Any type' ? '' : viewValue;
                });
            }
        };
    }
})();
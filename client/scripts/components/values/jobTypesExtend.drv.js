(function() {
    angular.module('simplejobs')
        .directive('jobTypesExtend', jobTypesExtend);

    jobTypesExtend.$inject = ['$window'];

    function jobTypesExtend($window) {

        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ctrl) {
                scope.jobTypes = angular.copy($window.values.jobTypes);
                scope.jobTypes.unshift('Any type');

                ctrl.$render = function() {
                    scope.jobType = ctrl.$viewValue;
                };

                ctrl.$parsers.push(function(viewValue) {
                    return viewValue === 'Any type' ? null : viewValue;
                });
            }
        };
    }
})();
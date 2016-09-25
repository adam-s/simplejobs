(function() {
    angular.module('simplejobs')
        .directive('jobTypesMultipleExtend', jobTypesMultipleExtend);

    jobTypesMultipleExtend.$inject = ['$window'];

    function jobTypesMultipleExtend($window) {

        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope) {
                scope.jobTypes = angular.copy($window.values.jobTypes);
            }
        };
    }
})();
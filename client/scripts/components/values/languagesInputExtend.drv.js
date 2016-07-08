(function() {
    angular.module('simplejobs')
        .directive('languagesInputExtend', languagesInputExtend);

    languagesInputExtend.$inject = ['$window'];

    function languagesInputExtend($window) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ctrl) {
                scope.languages = angular.copy($window.values.languages);

                ctrl.$render = function() {
                    scope.language = ctrl.$viewValue;
                };
            }
        }
    }
})();
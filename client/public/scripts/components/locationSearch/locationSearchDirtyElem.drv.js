(function() {
    angular.module('simplejobs')
        .directive('locationSearchDirtyElem', locationSearchDirtyElem);

    locationSearchDirtyElem.$inject = [];

    function locationSearchDirtyElem() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(function() {
                    return ctrl.$modelValue;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) ctrl.$setTouched();

                })
            }
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .directive('locationSearch', locationSearch);

    locationSearch.$inject = [];

    function locationSearch() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/components/locationSearch/locationSearch.tpl.html',
            require: 'ngModel',
            controller: 'locationSearchCtrl',
            scope: {},
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            ctrl.$render = function() {
                scope.place = angular.copy(ctrl.$viewValue);
            };

            scope.$watch('place', function(newVal, oldVal) {
                if (scope.place) {
                    ctrl.$setViewValue(angular.copy(scope.place))
                }
            })
        }
    }

})();
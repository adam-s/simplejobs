(function() {
    angular.module('simplejobs')
        .directive('locationSearch', locationSearch);

    locationSearch.$inject = [];

    function locationSearch() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/components/locationSearch/locationSearch.tpl.html',
            scope: {
                ngModel: '=',
                label: '@?'
            },
            controller: 'locationSearchCtrl'
        };
    }
})();
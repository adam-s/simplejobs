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
            controller: 'locationSearchCtrl',
            link: link
        };

        function link(scope, element, attrs) {

            scope.$watch('ngModel', function(newVal) {
                if (newVal && newVal.hasOwnProperty('$$hashKey')) {
                    var inputElement = element.find('input');
                    inputElement.val('');
                    // Hack to set label to initial position
                    inputElement.focus();
                    inputElement.blur();
                }
            });
        }
    }

})();
(function() {
    angular.module('simplejobs')
        .directive('sjEmptyResults', sjEmptyResults);

    sjEmptyResults.$inject = [];

    function sjEmptyResults() {
        return {
            restrict: 'E',
            templateUrl: 'scripts/components/sjEmptyResults/sjEmptyResults.tpl.html',
            scope: {
                resultSet: '='
            },
            link: function(scope, element, attrs) {

            }
        }
    }
})();
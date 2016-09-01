(function() {
    angular.module('simplejobs')
        .directive('requireResume', requireResume);

    requireResume.$inject = [];

    function requireResume() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                resume: '=requireResume'
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                // ngModelCtrl.$validators.requireResume = function() {
                //     console.log(scope.resume);
                //     return true;
                // }
            }
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .directive('portsInputExtend', portsInputExtend);

    portsInputExtend.$inject = ['$window'];

    function portsInputExtend($window) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ctrl) {

                scope.ports = angular.copy($window.values.popularPorts);
                scope.ports.unshift({name: 'All locations'});

                ctrl.$parsers.push(function(viewValue) {
                    console.log(viewValue);
                    return viewValue.name === 'All locations' ? null : viewValue;
                });


                ctrl.$formatters.push(function(modelValue) {
                    console.log('formatters', modelValue);
                    return modelValue;
                })
            }
        }
    }
})();
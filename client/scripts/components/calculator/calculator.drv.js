(function() {
    angular.module('live')
        .directive('calculator', calculator);

    calculator.$inject = [];

    function calculator() {
        var directive = {
            restrict: 'E',
            controller: 'CalculatorCtrl',
            controllerAs: 'vm',
            bindToController: true,
            scope: {},
            templateUrl: 'scripts/components/calculator/calculator.tpl.html'
        }

        return directive;
    }
})();
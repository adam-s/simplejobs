(function() {
    angular.module('live')
        .controller('CalculatorCtrl', CalculatorCtrl);

    CalculatorCtrl.$inject = [];

    function CalculatorCtrl() {
        var vm = this;
        vm.displayValue = 0;
        vm.valueA = 0;
        vm.valueB = 0;
        vm.selectedOperation = null;
        vm.clearValue = true;

        vm.equalSignKey = {
            label: "="
        };

        vm.digitKeys = [
            {label: "1", value: 1},
            {label: "2", value: 2},
            {label: "3", value: 3},
            {label: "4", value: 4},
            {label: "5", value: 5},
            {label: "6", value: 6},
            {label: "7", value: 7},
            {label: "8", value: 8},
            {label: "9", value: 9},
            {label: "0", value: 0}
        ];

        vm.operationKeys = [
            {label: "/", operation: function (a, b) {return a / b }},
            {label: "*", operation: function (a, b) {return a * b }},
            {label: "+", operation: function (a, b) {return a + b }},
            {label: "-", operation: function (a, b) {return a - b }}
        ];

        vm.digitClicked = function (digit) {
            if (vm.clearValue) {
                vm.displayValue = digit;
                vm.clearValue = false;
            } else {
                vm.displayValue = vm.displayValue * 10 + digit;
            }

            vm.valueB = vm.displayValue;
        };

        vm.operationClicked = function(operation) {
            vm.selectedOperation = operation;
            vm.valueA = vm.displayValue;
            vm.valueB = vm.displayValue;
            vm.clearValue = true;
        };

        vm.compute = function () {
            if(vm.selectedOperation != null) {
                vm.displayValue = Math.floor(vm.selectedOperation(vm.valueA, vm.valueB));
                vm.clearValue = true;
                vm.valueA = vm.displayValue;
            }
        };
    }

})();
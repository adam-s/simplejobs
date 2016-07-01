(function() {
    angular.module('simplejobs')
        .directive('sjHeader', sjHeader);

    sjHeader.$inject = [];

    function sjHeader() {
        var directive = {
            restrict: 'E',
            replace: true,
            controller: 'HeaderCtrl',
            controllerAs: 'vm',
            templateUrl: 'scripts/components/header/header.tpl.html',
            bindToController: true,
            scope: {}
        };

        return directive;
    }
})();
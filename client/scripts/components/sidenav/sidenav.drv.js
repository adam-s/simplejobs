(function() {
    angular.module('simplejobs')
        .directive('sjSidenav', sjSidenav);

    sjSidenav.$inject = [];

    function sjSidenav() {
        var directive = {
            restrict: 'E',
            replace: true,
            controller: 'SidenavCtrl',
            controllerAs: 'vm',
            templateUrl: 'scripts/components/sidenav/sidenav.tpl.html',
            bindToController: true,
            scope: {}
        };

        return directive;
    }
})();
(function() {
    angular.module('simplejobs')
        .directive('usermenu', usermenu);

    usermenu.$inject = [];

    function usermenu() {
        return {
            restrict: 'E',
            templateUrl: 'scripts/components/usermenu/usermenu.tpl.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: 'usermenuCtrl'
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .controller('SidenavCtrl', SidenavCtrl);

    SidenavCtrl = ['$mdSidenav'];

    function SidenavCtrl($mdSidenav) {
        vm = this;

        vm.toggleSidenav = toggleSidenav;

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
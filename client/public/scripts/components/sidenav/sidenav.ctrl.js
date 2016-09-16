(function() {
    angular.module('simplejobs')
        .controller('SidenavCtrl', SidenavCtrl);

    SidenavCtrl = ['$mdSidenav'];

    function SidenavCtrl($mdSidenav) {
        vm = this;

        vm.toggleSidenav = toggleSidenav;
        vm.closeSidenav = closeSidenav;

        function closeSidenav() {
            $mdSidenav('left').close();
        }

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
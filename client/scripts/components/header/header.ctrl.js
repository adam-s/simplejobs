(function() {
    angular.module('simplejobs')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['$mdSidenav'];

    function HeaderCtrl($mdSidenav) {
        vm = this;

        vm.toggleSidenav = toggleSidenav;

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
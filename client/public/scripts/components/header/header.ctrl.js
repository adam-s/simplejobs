(function() {
    angular.module('simplejobs')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['$state', '$mdSidenav'];

    function HeaderCtrl($state, $mdSidenav) {
        vm = this;

        vm.toggleSidenav = toggleSidenav;
        vm.getTitle = getTitle;

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }

        function getTitle() {
            if ($state.current.data && $state.current.data.title) {
                return $state.current.data.title;
            }

            return '';
        }
    }
})();
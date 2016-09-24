(function() {
    angular.module('simplejobs')
        .controller('SidenavCtrl', SidenavCtrl);

    SidenavCtrl = ['$rootScope', '$mdSidenav', '$state', 'Auth'];

    function SidenavCtrl($rootScope, $mdSidenav, $state, Auth) {
        vm = this;

        vm.currentState = $state.current.name;
        vm.isLoggedIn = Auth.isLoggedIn;
        vm.toggleSidenav = toggleSidenav;
        vm.closeSidenav = closeSidenav;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            vm.currentState = toState.name;
        });

        function closeSidenav() {
            $mdSidenav('left').close();
        }

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
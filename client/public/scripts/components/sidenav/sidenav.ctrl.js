(function() {
    angular.module('simplejobs')
        .controller('SidenavCtrl', SidenavCtrl);

    SidenavCtrl = ['$scope', '$mdSidenav', '$state', 'Auth'];

    function SidenavCtrl($scope, $mdSidenav, $state, Auth) {
        vm = this;

        vm.currentState = $state.current.name;
        vm.isLoggedIn = Auth.isLoggedIn;
        vm.toggleSidenav = toggleSidenav;
        vm.closeSidenav = closeSidenav;

        $scope.$watch(function() {
            return $state.current.name;
        }, function(newValue) {
            vm.currentState = newValue;
        });

        function closeSidenav() {
            $mdSidenav('left').close();
        }

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
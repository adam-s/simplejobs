(function() {
    angular.module('simplejobs')
        .controller('SidenavCtrl', SidenavCtrl);

    SidenavCtrl = ['$scope', '$mdSidenav', '$state', 'Auth'];

    function SidenavCtrl($scope, $mdSidenav, $state, Auth) {
        sidenav = this;

        sidenav.currentState = $state.current.name;
        sidenav.isLoggedIn = Auth.isLoggedIn;
        sidenav.toggleSidenav = toggleSidenav;
        sidenav.closeSidenav = closeSidenav;

        $scope.$watch(function() {
            return $state.current.name;
        }, function(newValue) {
            sidenav.currentState = newValue;
        });

        function closeSidenav() {
            $mdSidenav('left').close();
        }

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }
    }
})();
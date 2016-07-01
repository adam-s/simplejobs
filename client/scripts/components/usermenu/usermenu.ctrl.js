(function() {
    angular.module('simplejobs')
        .controller('usermenuCtrl', usermenuCtrl);

    usermenuCtrl.$inject = ['Auth'];

    function usermenuCtrl(Auth) {
        var vm = this;
        vm.getMe = Auth.getMe;
        vm.openMenu = openMenu;
        vm.logout = logout;

        function openMenu($mdOpenMenu, $event) {
            $mdOpenMenu($event);
        }

        function logout() {
            Auth.logout();
        }
    }
})();
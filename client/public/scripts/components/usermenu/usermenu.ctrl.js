(function() {
    angular.module('simplejobs')
        .controller('usermenuCtrl', usermenuCtrl);

    usermenuCtrl.$inject = ['Auth', 'loginService'];

    function usermenuCtrl(Auth, loginDialog) {
        var vm = this;
        vm.getMe = Auth.getMe;
        vm.openMenu = openMenu;
        vm.login = loginDialog.open;
        vm.logout = logout;

        function openMenu($mdOpenMenu, $event) {
            $mdOpenMenu($event);
        }

        function logout() {
            Auth.logout();
        }
    }
})();
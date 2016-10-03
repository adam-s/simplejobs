(function() {
    angular.module('simplejobs')
        .controller('usermenuCtrl', usermenuCtrl);

    usermenuCtrl.$inject = ['$mdMedia', 'Auth', 'loginService'];

    function usermenuCtrl($mdMedia, Auth, loginDialog) {
        var vm = this;
        vm.getMe = Auth.getMe;
        vm.openMenu = openMenu;
        vm.login = loginDialog.open;
        vm.logout = logout;
        vm.$mdMedia = $mdMedia;

        function openMenu($mdOpenMenu, $event) {
            $mdOpenMenu($event);
        }

        function logout() {
            Auth.logout();
        }
    }
})();
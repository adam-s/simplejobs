(function() {
    angular.module('simplejobs')
        .factory('loginService', loginService);

    loginService.$inject = ['$mdDialog', '$mdMedia'];

    function loginService($mdDialog, $mdMedia) {
        return {
            open: open
        };

        function open($event) {
            var fullscreen = $mdMedia('xs');

            $mdDialog.show({
                controller: 'loginCtrl as vm',
                bindToController: true,
                templateUrl: 'scripts/components/login/login.tpl.html',
                targetEvent: $event,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: fullscreen
            })
        }
    }
})();
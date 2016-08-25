(function() {
    angular.module('simplejobs')
        .controller('passwordChangeCtrl', passwordChangeCtrl);

    passwordChangeCtrl.$inject = ['Auth'];

    function passwordChangeCtrl(Auth) {
        var vm = this;
        vm.me = Auth.getMe();
        vm.submit = submit;
        vm.disabledFlag = false;

        function submit() {
            vm.disabledFlag = true;
            Auth.passwordChange(vm.me)
                .then(function(response) {
                    vm.disabledFlag = false;
                }, function(response) {
                    vm.disabledFlag = false;
                })
        }
    }
})();
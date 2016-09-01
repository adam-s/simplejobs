(function() {
    angular.module('simplejobs')
        .controller('emailCtrl', emailCtrl);

    emailCtrl.$inject = ['Auth'];

    function emailCtrl(Auth) {
        var vm = this;
        vm.me = Auth.getMe();
        vm.submit = submit;
        vm.disabledFlag = false;

        function submit() {
            vm.disabledFlag = true;
            Auth.email(vm.me)
                .then(function(response) {
                    vm.disabledFlag = false;
                }, function(response) {
                    vm.disabledFlag = false;
                })
        }
    }
})();
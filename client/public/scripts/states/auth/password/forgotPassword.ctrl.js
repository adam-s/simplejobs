(function() {
    angular.module('simplejobs')
        .controller('forgotPasswordCtrl', forgotPasswordCtrl);

    forgotPasswordCtrl.$inject = ['$mdToast', 'Auth', 'errorHandler'];

    function forgotPasswordCtrl($mdToast, Auth, errorHandler) {
        var vm = this;

        vm.submitDisabled = false;

        vm.submit = function() {
            console.log(vm.email);
            vm.submitDisabled = true;
            Auth.forgotPassword(vm.email)
                .then(function(response) {
                    console.log(response);
                    var toast = $mdToast.simple().textContent(response.message);
                    $mdToast.show(toast);
                }, function(response) {
                    console.log(response);
                    errorHandler.handleValidationErrors(response);
                })
                .finally(function() {
                    vm.submitDisabled = false;
                });

        }
    }
})();
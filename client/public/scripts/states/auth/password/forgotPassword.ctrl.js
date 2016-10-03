(function() {
    angular.module('simplejobs')
        .controller('forgotPasswordCtrl', forgotPasswordCtrl);

    forgotPasswordCtrl.$inject = ['$mdDialog', 'Auth', 'errorHandler'];

    function forgotPasswordCtrl($mdDialog, Auth, errorHandler) {
        var vm = this;

        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            Auth.forgotPassword(vm.email)
                .then(function(response) {
                    var alert = $mdDialog.alert({
                        title: response.message,
                        ok: 'Close'
                    });

                    $mdDialog.show(alert);
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                })
                .finally(function() {
                    vm.submitDisabled = false;
                });

        }
    }
})();
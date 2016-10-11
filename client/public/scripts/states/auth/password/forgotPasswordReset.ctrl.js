(function() {
    angular.module('simplejobs')
        .controller('forgotPasswordResetCtrl', forgotPasswordResetCtrl);

    forgotPasswordResetCtrl.$inject = ['$mdToast', '$state', 'Auth', 'errorHandler'];

    function forgotPasswordResetCtrl($mdToast, $state, Auth, errorHandler) {
        var vm = this;
        vm.submit = submit;
        vm.submitDisabled = false;
        vm.body = {};
        vm.body.token = $state.params.token;

        function submit() {
            vm.submitDisabled = true;
            Auth.forgotPasswordReset(vm.body)
                .then(function(response) {
                    // $scope.passwordChangeForm.$setPristine();
                    // $scope.passwordChangeForm.$setUntouched();
                    var toast = $mdToast.simple().textContent('Password updated');
                    $mdToast.show(toast);

                    console.log(response);
                    Auth.setMe(response);

                    $state.go('home', {}, {reload: true});
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                })
                .finally(function() {
                    vm.submitDisabled = false;
                })
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .controller('passwordChangeCtrl', passwordChangeCtrl);

    passwordChangeCtrl.$inject = ['$scope', '$mdToast', 'Auth', 'errorHandler'];

    function passwordChangeCtrl($scope, $mdToast, Auth, errorHandler) {
        var vm = this;
        vm.me = angular.copy(Auth.getMe());
        vm.submit = submit;
        vm.submitDisabled = false;

        function submit() {
            vm.submitDisabled = true;
            Auth.passwordChange(vm.me)
                .then(function() {
                    vm.submitDisabled = false;

                    vm.me = {};
                    vm.me = angular.copy(Auth.getMe());

                    $scope.passwordChangeForm.$setPristine();
                    $scope.passwordChangeForm.$setUntouched();

                    var toast = $mdToast.simple().textContent('Password updated');
                    $mdToast.show(toast);
                }, function(response) {
                    console.log(response);
                    errorHandler.handleValidationErrors(response);
                    vm.submitDisabled = false;
                })
        }
    }
})();
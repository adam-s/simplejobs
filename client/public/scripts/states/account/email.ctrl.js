(function() {
    angular.module('simplejobs')
        .controller('emailCtrl', emailCtrl);

    emailCtrl.$inject = ['$scope', '$mdToast', 'Auth', 'errorHandler'];

    function emailCtrl($scope, $mdToast, Auth, errorHandler) {
        var vm = this;
        vm.me = angular.copy(Auth.getMe());
        vm.submit = submit;
        vm.submitDisabled = false;

        function submit() {
            vm.submitDisabled = true;
            Auth.email(vm.me)
                .then(function(response) {
                    vm.submitDisabled = false;

                    vm.me = {};
                    vm.me = angular.copy(Auth.getMe());

                    $scope.emailForm.$setPristine();
                    $scope.emailForm.$setUntouched();

                    var toast = $mdToast.simple().textContent('Email updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                    vm.submitDisabled = false;
                })
        }
    }
})();
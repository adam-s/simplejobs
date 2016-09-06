(function() {
    angular.module('simplejobs')
        .controller('adminUserDetailCtrl', adminUserDetailCtrl);

    adminUserDetailCtrl.$inject = ['$state', '$mdToast', 'userApi', 'user', 'errorHandler'];

    function adminUserDetailCtrl($state, $mdToast, userApi, user, errorHandler) {
        var vm = this;
        vm.user = user;
        vm.submitDisabled = false;

        vm.roles = ['anonymous', 'authenticated', 'administrator'];

        vm.hasRole = function(item, list) {
            return list.indexOf(item) > -1;
        };

        vm.toggle = function(item, list) {
            var index = list.indexOf(item);
            if (index > -1) {
                list.splice(index, 1);
            } else {
                list.push(item);
            }
        };

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof user === 'undefined');
            var submitFn = add ? userApi.create.bind(userApi) : userApi.update.bind(userApi);
            submitFn(vm.user)
                .then(function(response) {
                    vm.submitDisabled = false;
                    vm.user = response;
                    $state.go('adminUserEdit', {id: response._id});
                    var toast = $mdToast.simple().textContent('User updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                    vm.submitDisabled = false;
                });
        };
    }
})();
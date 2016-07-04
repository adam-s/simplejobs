(function() {
    angular.module('simplejobs')
        .controller('adminUserDetailCtrl', adminUserDetailCtrl);

    adminUserDetailCtrl.$inject = ['$state', 'userApi', 'user'];

    function adminUserDetailCtrl($state, userApi, user) {
        var vm = this;
        vm.user = user;
        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof user === 'undefined');
            var submitFn = add ? userApi.create.bind(userApi) : userApi.update.bind(userApi);
            submitFn(vm.user)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('userEdit', {id: response._id});
                });
        };
    }
})();
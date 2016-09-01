(function() {
    angular.module('simplejobs')
        .controller('adminJobDetailCtrl', adminJobDetailCtrl);

    adminJobDetailCtrl.$inject = ['$state', 'jobApi', 'job'];

    function adminJobDetailCtrl($state, jobApi, job) {
        var vm = this;
        vm.job = job;
        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof job === 'undefined');
            var submitFn = add ? jobApi.create.bind(jobApi) : jobApi.update.bind(jobApi);
            submitFn(vm.job)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('adminJobEdit', {id: response._id});
                });
        };
    }
})();
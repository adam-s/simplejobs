(function() {
    angular.module('simplejobs')
        .controller('jobDetailCtrl', jobDetailCtrl);

    jobDetailCtrl.$inject = ['$state', 'jobApi', 'job'];

    function jobDetailCtrl($state, jobApi, job) {
        var vm = this;
        vm.job = job;
        vm.submitDisabled = false;

        vm.submit = function() {
            console.log(jobApi);
            vm.submitDisabled = true;
            var add = (typeof job === 'undefined');
            var submitFn = add ? jobApi.create.bind(jobApi) : jobApi.update.bind(jobApi);
            submitFn(vm.job)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('jobEdit', {id: response._id});
                });
        };
    }
})();
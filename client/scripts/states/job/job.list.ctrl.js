(function() {
    angular.module('simplejobs')
        .controller('jobListCtrl', jobListCtrl);

    jobListCtrl.$inject = ['$timeout', '$location', '$stateParams', '$state', '$mdDialog', 'jobApi', 'job', 'errorHandler'];

    function jobListCtrl($timeout, $location, $stateParams, $state, $mdDialog, jobApi, job, errorHandler) {
        var vm = this;
        vm.jobs = job.records;
        vm.count = job.metadata.totalCount;
        vm.tableState = angular.copy($stateParams);
        vm.switchIsDisabled = [];
        vm.fetch = fetch;
        vm.activeChange = activeChange;
        vm.edit = edit;
        vm.delete = remove;

        function fetch() {
            vm.promise = jobApi
                .index(vm.tableState)
                .then(function(response) {
                    $location.search(vm.tableState);
                    vm.jobs = response.records;
                    vm.count = response.metadata.totalCount;
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                });
        }

        function activeChange(job, $index) {
            vm.switchIsDisabled[$index] = true;
            jobApi
                .update(job)
                .then(function(response) {
                    console.log(response);
                    vm.switchIsDisabled[$index] = false;
                }, function(response) {
                    errorHandler.handleValidationErrors(response, function(){
                        vm.switchIsDisabled[$index] = false;
                        job.active = !job.active;
                    });
                })
        }


        function edit(id) {
            $state.go('jobEdit', {id: id})
        };

        function remove() {

        }
    }
})();
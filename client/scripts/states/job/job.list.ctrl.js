(function() {
    angular.module('simplejobs')
        .controller('jobListCtrl', jobListCtrl);

    jobListCtrl.$inject = ['$timeout', '$location', '$stateParams', '$state', '$mdDialog', '$mdToast', 'jobApi', 'job', 'errorHandler'];

    function jobListCtrl($timeout, $location, $stateParams, $state, $mdDialog, $mdToast, jobApi, job, errorHandler) {
        var vm = this;
        vm.jobs = job.records;
        vm.count = job.metadata.totalCount;
        vm.tableState = angular.copy($stateParams);
        vm.switchIsDisabled = [];
        vm.fetch = fetch;
        vm.activeChange = activeChange;
        vm.edit = edit;
        vm.remove = remove;

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
                .then(function() {
                    vm.switchIsDisabled[$index] = false;
                    var toast = $mdToast.simple().textContent('Job listing updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response, function(){
                        vm.switchIsDisabled[$index] = false;
                        job.active = !job.active;
                    });
                })
        }


        function edit(id) {
            $state.go('jobEdit', {id: id})
        }

        function remove(id, $event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this job?')
                .targetEvent($event)
                .ok('Delete now')
                .cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(function ok() {
                    jobApi
                        .remove(id)
                        .then(function() {
                            $state.go('myJobList', {}, {reload: true});
                        }, function cancel(){})
                });
        }
    }
})();
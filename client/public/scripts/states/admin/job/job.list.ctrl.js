(function() {
    angular.module('simplejobs')
        .controller('adminJobListCtrl', adminJobListCtrl);

    adminJobListCtrl.$inject = ['$window', '$state', '$mdToast', '$mdDialog', 'jobApi', 'job'];

    function adminJobListCtrl($window, $state, $mdToast, $mdDialog, jobApi, job) {
        var vm = this;
        vm.jobs = job.records;
        vm.count = job.metadata.totalCount;

        console.log(vm.jobs[0]);

        vm.tableState = angular.copy($state.params);

        vm.fetchJobs = function() {
            var tableState = angular.copy(vm.tableState);
            vm.promise = jobApi
                .index(tableState)
                .then(function(response) {
                    vm.jobs = response.records;
                    vm.count = response.metadata.totalCount;
                    $state.go('.', tableState)
                });
        };

        vm.addJob = function() {
            $state.go('adminJobEdit', {id: 'add'})
        };

        vm.editJob = function(id) {
            $state.go('adminJobEdit', {id: id})
        };

        vm.deleteJob = function(id, $event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this job')
                .targetEvent($event)
                .ok('Delete now')
                .cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(function ok() {
                    jobApi
                        .remove(id)
                        .then(function() {
                            $state.go('adminJobList', {}, {reload: true});
                            var toast = $mdToast.simple().textContent('Job listing deleted');
                            $mdToast.show(toast);
                        }, function (){
                            // Error happened
                        })
                });
        };

        // @link http://stackoverflow.com/questions/19493759/how-to-invoke-mailto-in-angularjs-controller
        vm.sendMail = function(email) {
            $window.open("mailto:" + email)
        };
    }
})();
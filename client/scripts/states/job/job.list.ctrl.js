(function() {
    angular.module('simplejobs')
        .controller('jobListCtrl', jobListCtrl);

    jobListCtrl.$inject = ['$location', '$stateParams', '$state', '$mdDialog', 'jobApi', 'job'];

    function jobListCtrl($location, $stateParams, $state, $mdDialog, jobApi, job) {
        var vm = this;
        vm.jobs = job.records;
        vm.count = job.metadata.totalCount;
        vm.tableState = $stateParams;
        vm.fetch = fetch;
        vm.edit = edit;
        vm.delete = remove;

        function fetch() {
            vm.promise = jobApi
                .index(vm.tableState)
                .then(function(response) {
                    vm.jobs = response.records;
                    vm.count = response.metadata.totalCount;
                    $location.search(vm.tableState);
                }, function(response) {
                    console.log('Handle jobListCtrl error');
                });
        }

        function edit() {

        }

        function remove() {

        }
    }
})();
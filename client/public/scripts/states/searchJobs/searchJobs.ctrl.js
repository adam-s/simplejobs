(function() {
    angular.module('simplejobs')
        .controller('searchJobsCtrl', searchJobsCtrl);

    searchJobsCtrl.$inject = ['$location', '$state', 'jobs'];

    function searchJobsCtrl($location, $state, jobs) {
        var vm = this;
        vm.jobs = jobs.records;
        vm.count = jobs.metadata.totalCount;
        vm.tableState = angular.copy($state.params);

        vm.fetchJobs = function() {
            console.log('shit');
            $location.search(vm.tableState);
        }
    }
})();
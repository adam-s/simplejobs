(function() {
    angular.module('simplejobs')
        .controller('searchJobsCtrl', searchJobsCtrl);

    searchJobsCtrl.$inject = ['$location', '$state', '$mdDialog', '$mdMedia', 'sjDistance', 'jobs'];

    function searchJobsCtrl($location, $state, $mdDialog, $mdMedia, sjDistance, jobs) {
        var vm = this;

        vm.jobs = jobs.records;
        vm.count = jobs.metadata.totalCount;
        vm.tableState = tableState = angular.copy($state.params);

        vm.fetchJobs = function() {
            $location.search(vm.tableState);
        };

        vm.showFilterDialog = function($event) {
            var fullscreen = $mdMedia('xs'); // Only fullscreen on smallest screens
            $mdDialog.show({
                controller: 'searchJobsDialogFilterCtrl',
                bindToController: true,
                controllerAs: 'dialog',
                templateUrl: 'scripts/states/searchJobs/searchJobsDialogFilter.tpl.html',
                targetEvent: $event,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: fullscreen,
                locals: {
                    tableState: angular.copy(vm.tableState)
                }
            })
                .then(function(tableState) {
                    console.log(tableState);
                    vm.tableState = tableState;
                    $location.search(vm.tableState);
                }, function(){})
        };

        vm.showDialog = function($event) {
            $mdDialog.show({
                controller: 'searchJobsDialogCtrl',
            })
        };

        vm.clearFilter = function() {
            vm.tableState = {
                limit: vm.tableState.limit,
                page: vm.tableState.page
            };

            $location.search(vm.tableState);
        };

        var calculator = sjDistance(vm.distanceUnit),
            tableState = vm.tableState;
        vm.proximity = !!(tableState.longitude && tableState.latitude); // Should we show the distance? Sometimes yes. Sometimes no.
        vm.distanceUnit = 'km';
        vm.distanceFn = function(lat1, lon1) {
            var lat2 = tableState.latitude,
                lon2 = tableState.longitude;

            return calculator(lat1, lon1, lat2, lon2);
        };
    }
})();
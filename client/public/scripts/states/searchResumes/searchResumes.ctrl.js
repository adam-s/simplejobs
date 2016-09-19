(function() {
    angular.module('simplejobs')
        .controller('searchResumesCtrl', searchResumesCtrl);

    searchResumesCtrl.$inject = ['$location', '$state', '$mdDialog', '$mdMedia', 'sjDistance', 'resumes'];

    function searchResumesCtrl($location, $state, $mdDialog, $mdMedia, sjDistance, resumes) {
        var vm = this;

        vm.resumes = resumes.records;
        vm.count = resumes.metadata.totalCount;
        vm.tableState = tableState = angular.copy($state.params);
        console.log(vm.resumes[0]);

        vm.fetchResumes = function() {
            $location.search(vm.tableState);
        };

        vm.showFilterDialog = function($event) {
            var fullscreen = $mdMedia('xs'); // Only fullscreen on smallest screens
            $mdDialog.show({
                controller: 'searchResumesDialogFilterCtrl',
                bindToController: true,
                controllerAs: 'dialog',
                templateUrl: 'scripts/states/searchResumes/searchResumesDialogFilter.tpl.html',
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

        vm.showDialog = function(resume, $event) {
            $mdDialog.show({
                controller: 'searchResumesDialogCtrl',
                bindToController: true,
                controllerAs: 'dialog',
                templateUrl: 'scripts/states/searchResumes/searchResumesDialog.tpl.html',
                targetEvent: $event,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true,
                locals: {
                    resume: resume
                }
            });
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
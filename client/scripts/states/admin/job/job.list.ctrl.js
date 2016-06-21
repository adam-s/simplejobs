(function() {
    angular.module('simplejobs')
        .controller('jobListCtrl', jobListCtrl);

    jobListCtrl.$inject = ['$scope', '$location', '$stateParams', '$state', '$mdDialog', 'jobApi', 'job'];

    function jobListCtrl($scope, $location, $stateParams, $state, $mdDialog, jobApi, job) {
        var vm = this;
        vm.job = job.records;
        vm.count = job.metadata.totalCount;

        vm.tableState = $stateParams;

        $scope.$watchCollection(function() {
            return vm.tableState;
        }, function(newVal) {
            $location.search(newVal);
        });

        vm.fetchCrew = function() {
            vm.promise = jobApi
                .index(vm.tableState)
                .then(function(response) {
                    console.log(response);
                    vm.job = response.records;
                    vm.count = response.metadata.totalCount;
                });
        };

        vm.addCrew = function() {
            $state.go('jobEdit', {id: 'add'})
        };

        vm.editCrew = function(id) {
            $state.go('jobEdit', {id: id})
        };

        vm.deleteCrew = function(id, $event) {
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
                            $state.go('jobList', {}, {reload: true});
                        }, function cancel(){})
                });
        };


    }
})();
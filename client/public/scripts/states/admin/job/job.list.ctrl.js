(function() {
    angular.module('simplejobs')
        .controller('adminJobListCtrl', adminJobListCtrl);

    adminJobListCtrl.$inject = ['$window', '$location', '$state', '$mdToast', '$mdDialog', 'jobApi', 'job'];

    function adminJobListCtrl($window, $location, $state, $mdToast, $mdDialog, jobApi, job) {
        var vm = this;
        vm.jobs = job.records;
        vm.count = job.metadata.totalCount;

        vm.tableState = angular.copy($state.params);

        vm.fetchJobs = function() {
            $location.search(vm.tableState);
            // vm.promise = jobApi
            //     .index(tableState)
            //     .then(function(response) {
            //         vm.jobs = response.records;
            //         vm.count = response.metadata.totalCount;
            //         $state.go('.', tableState)
            //     });
        };

        vm.addJob = function() {
            $state.go('adminJobEdit', {id: 'add'})
        };

        vm.editJob = function(id) {
            $state.go('adminJobEdit', {id: id})
        };

        vm.editAuthor = function(id) {
            $state.go('adminUserEdit', {id: id})
        };

        vm.deleteJob = function(id, $event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this searchJob')
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

        vm.showFilterDialog = function($event) {
            $mdDialog.show({
                controller: 'jobDialogFilterCtrl',
                bindToController: true,
                controllerAs: 'dialog',
                templateUrl: 'scripts/states/admin/searchJob/jobDialogFilter.tpl.html',
                targetEvent: $event,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true,
                locals: {
                    tableState: angular.copy(vm.tableState)
                }
            })
            .then(function(tableState) {
                vm.tableState = tableState;
                console.log(vm.tableState);
                $location.search(vm.tableState);
            }, function(){})
        };

        vm.clearFilter = function() {
            vm.tableState = {
                limit: vm.tableState.limit,
                page: vm.tableState.page
            };

            $location.search(vm.tableState);
        }
    }
})();
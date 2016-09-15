(function() {
    angular.module('simplejobs')
        .controller('adminUserListCtrl', adminUserListCtrl);

    adminUserListCtrl.$inject = ['$location', '$state', '$mdToast', '$mdDialog', 'userApi', 'user'];

    function adminUserListCtrl($location, $state, $mdToast, $mdDialog, userApi, user) {
        var vm = this;
        vm.user = user.records;
        vm.count = user.metadata.totalCount;

        vm.tableState = angular.copy($state.params);

        vm.fetchCrew = function() {
            $location.search(vm.tableState);
        };

        vm.addCrew = function() {
            $state.go('adminUserEdit', {id: 'add'})
        };

        vm.edit = function(id) {
            $state.go('adminUserEdit', {id: id})
                .finally(function(error) {
                    console.log(error);
                })
        };

        vm.editCrew = function(id) {
            $state.go('adminCrewEdit', {id: id})
                .finally(function(error) {
                    console.log(error);
                });
        };

        vm.delete = function(id, $event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this user')
                .targetEvent($event)
                .ok('Delete now')
                .cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(function ok() {
                    userApi
                        .remove(id)
                        .then(function() {
                            $state.go('adminUserList', {}, {reload: true});
                            var toast = $mdToast.simple().textContent('User deleted');
                            $mdToast.show(toast);
                        }, function cancel(){})
                });
        };

        vm.viewJobList = function(id) {
            $state.go('adminJobList', { author: id});
        };

        vm.showFilterDialog = function($event) {
            $mdDialog.show({
                controller: 'userDialogFilterCtrl',
                bindToController: true,
                controllerAs: 'dialog',
                templateUrl: 'scripts/states/admin/user/userDialogFilter.tpl.html',
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
        };

    }
})();
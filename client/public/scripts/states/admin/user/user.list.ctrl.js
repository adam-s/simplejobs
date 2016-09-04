(function() {
    angular.module('simplejobs')
        .controller('adminUserListCtrl', adminUserListCtrl);

    adminUserListCtrl.$inject = ['$scope', '$location', '$stateParams', '$state', '$mdDialog', 'userApi', 'user'];

    function adminUserListCtrl($scope, $location, $stateParams, $state, $mdDialog, userApi, user) {
        var vm = this;
        vm.user = user.records;
        vm.count = user.metadata.totalCount;

        console.log(vm.user[0])
        vm.tableState = $stateParams;

        $scope.$watchCollection(function() {
            return vm.tableState;
        }, function(newVal) {
            $location.search(newVal);
        });

        vm.fetchCrew = function() {
            vm.promise = userApi
                .index(vm.tableState)
                .then(function(response) {
                    vm.user = response.records;
                    vm.count = response.metadata.totalCount;
                });
        };

        vm.addCrew = function() {
            $state.go('adminUserEdit', {id: 'add'})
        };

        vm.editCrew = function(id) {
            $state.go('adminCrewEdit', {id: id})
                .catch(function() {
                    console.log(shit);
                })
        };

        vm.deleteCrew = function(id, $event) {
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
                        }, function cancel(){})
                });
        };


    }
})();
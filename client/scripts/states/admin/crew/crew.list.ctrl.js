(function() {
    angular.module('simplejobs')
        .controller('crewListCtrl', crewListCtrl);

    crewListCtrl.$inject = ['$scope', '$location', '$stateParams', '$state', '$mdDialog', 'crewApi', 'crew'];

    function crewListCtrl($scope, $location, $stateParams, $state, $mdDialog, crewApi, crew) {
        var vm = this;
        vm.crew = crew.records;
        vm.count = crew.metadata.totalCount;

        vm.tableState = $stateParams;

        $scope.$watchCollection(function() {
            return vm.tableState;
        }, function(newVal) {
            $location.search(newVal);
        });

        vm.fetchCrew = function() {
            vm.promise = crewApi
                .index(vm.tableState)
                .then(function(response) {
                    vm.crew = response.records;
                    vm.count = response.metadata.totalCount;
                });
        };

        vm.addCrew = function() {
            $state.go('crewEdit', {id: 'add'})
        };

        vm.editCrew = function(id) {
            $state.go('crewEdit', {id: id})
        };

        vm.deleteCrew = function(id, $event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this crew')
                .targetEvent($event)
                .ok('Delete now')
                .cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(function ok() {
                    crewApi
                        .remove(id)
                        .then(function() {
                            $state.go('crewList', {}, {reload: true});
                        }, function cancel(){})
                });
        };


    }
})();
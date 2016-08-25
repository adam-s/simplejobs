(function() {
    angular.module('simplejobs')
        .controller('adminCrewListCtrl', adminCrewListCtrl);

    adminCrewListCtrl.$inject = ['$scope', '$timeout', '$location', '$stateParams', '$state', '$mdDialog', 'crewApi', 'crew'];

    function adminCrewListCtrl($scope, $timeout, $location, $stateParams, $state, $mdDialog, crewApi, crew) {
        var vm = this;
        vm.crew = crew.records;
        vm.count = crew.metadata.totalCount;

        vm.tableState = angular.copy($state.params);



        // There is some hocky stuff going on. Things seem to work now following this blog post at
        // @link http://www.codelord.net/2015/11/25/query-parameters-in-ui-router-without-needless-reloading-with-example-project/

        vm.fetchCrew = function(page, limit) {
            vm.promise = crewApi
                .index({page: page, limit: limit})
                .then(function(response) {
                    vm.crew = response.records;
                    vm.count = response.metadata.totalCount;
                    $state.go('.', {page: page, limit: limit});
                });
        };

        vm.addCrew = function() {
            $state.go('adminCrewEdit', {id: 'add'})
        };

        // Construct edit dialog here.
        vm.editCrew = function(id) {
            $state.go('adminCrewEdit', {id: id})
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
                            $state.go('adminCrewList', {}, {reload: true});
                        }, function cancel(){})
                });
        };


    }
})();
(function() {
    angular.module('simplejobs')
        .controller('adminCrewDetailCtrl', adminCrewDetailCtrl);

    adminCrewDetailCtrl.$inject = ['$state', 'crewApi', 'crew'];

    function adminCrewDetailCtrl($state, crewApi, crew) {
        var vm = this;
        vm.crew = crew;
        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof crew === 'undefined');
            var submitFn = add ? crewApi.create.bind(crewApi) : crewApi.update.bind(crewApi);
            submitFn(vm.crew)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('adminCrewEdit', {id: response._id});
                });
        };
    }
})();
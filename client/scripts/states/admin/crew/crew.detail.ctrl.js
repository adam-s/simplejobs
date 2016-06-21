(function() {
    angular.module('simplejobs')
        .controller('crewDetailCtrl', crewDetailCtrl);

    crewDetailCtrl.$inject = ['$state', 'crewApi', 'crew'];

    function crewDetailCtrl($state, crewApi, crew) {
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
                    $state.go('crewEdit', {id: response._id});
                });
        };
    }
})();
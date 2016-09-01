(function() {
    angular.module('simplejobs')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$window', 'jobs'];

    function homeCtrl($window, jobs) {
        var vm = this;
        vm.positions = angular.copy($window.values.positions);
        vm.positions.unshift('All positions');
        vm.jobTypes = angular.copy($window.values.jobTypes);
        vm.jobTypes.unshift('All types');
        vm.locations = angular.copy($window.values.popularPorts);
        vm.locations.unshift({name: 'All locations'});
        vm.jobs = jobs.records;
    }
})();
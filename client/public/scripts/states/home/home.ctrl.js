(function() {
    angular.module('simplejobs')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$window', 'jobs'];

    function homeCtrl($window, jobs) {
        var vm = this;
    }
})();
(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'scripts/states/home/home.tpl.html',
                controller: 'homeCtrl as vm',
                resolve: {
                    jobs: ['jobApi', function(jobApi) {
                        return jobApi.index();
                    }]
                }
            })
    }
})();
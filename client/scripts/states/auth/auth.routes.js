(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'scripts/states/auth/auth.tpl.html',
                abstract: true
            });
    }
})();
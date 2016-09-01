(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('sidebar', {
                abstract: true,
                templateUrl: 'scripts/states/layouts/sidebar/sidebar.tpl.html'
            })
    }
})();
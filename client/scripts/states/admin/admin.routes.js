(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'scripts/states/admin/admin.tpl.html',
                abstract: true
            });
    }
})();
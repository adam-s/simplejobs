(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                template: '<ui-view/>',
                abstract: true
            });
    }
})();
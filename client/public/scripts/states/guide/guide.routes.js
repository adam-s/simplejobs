(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('guideOverview', {
                parent: 'sidebar',
                url: '/guide/overview',
                templateUrl: 'scripts/states/guide/overview.tpl.html'
            })
            .state('guideFaq', {
                parent: 'sidebar',
                url: '/guide/frequently-asked-questions',
                templateUrl: 'scripts/states/guide/faq.tpl.html'
            })
    }
})();
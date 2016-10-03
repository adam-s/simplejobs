(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('guideOverview', {
                parent: 'sidebar',
                url: '/guide/overview',
                templateUrl: 'scripts/states/guide/overview.tpl.html',
                data: {
                    title: 'App overview'
                }
            })
            .state('guideFaq', {
                parent: 'sidebar',
                url: '/guide/frequently-asked-questions',
                templateUrl: 'scripts/states/guide/faq.tpl.html',
                data: {
                    title: 'FAQ'
                }
            })
            .state('guideAccount', {
                parent: 'sidebar',
                url: '/guide/account',
                templateUrl: 'scripts/states/guide/account.tpl.html',
                data: {
                    title: 'Account guide'
                }
            })
            .state('guideProfile', {
                parent: 'sidebar',
                url: '/guide/profile',
                templateUrl: 'scripts/states/guide/profile.tpl.html',
                data: {
                    title: 'Resume profile guide'
                }
            })
            .state('guideJob', {
                parent: 'sidebar',
                url: '/guide/job',
                templateUrl: 'scripts/states/guide/job.tpl.html',
                data: {
                    title: 'Job listing guide'
                }
            })
    }
})();
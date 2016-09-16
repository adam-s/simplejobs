(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('myJobList', {
                url: '/searchJob/list?limit&page&author&order',
                parent: 'sidebar',
                controller: 'jobListCtrl as vm',
                templateUrl: 'scripts/states/searchJob/searchJob.list.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        var job = jobApi.index($stateParams);
                        return job;
                    }]
                },
                params: {
                    order: "-updated",
                    limit: "10",
                    page: "1",
                    author: ['Auth', function(Auth) {
                        return Auth.getMe()._id;
                    }]
                },
                reloadOnSearch: false,
                data: {
                    title: 'My searchJob listings'
                }
            })
            .state('jobEdit', {
                url: '/searchJob/:id/edit',
                parent: 'sidebar',
                controller: 'jobDetailCtrl as vm',
                templateUrl: 'scripts/states/searchJob/searchJob.edit.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return jobApi.detail($stateParams.id);
                    }]
                },
                data: {
                    title: 'Job edit',
                    permissions: {
                        only: ['addJob'],
                        redirectTo: 'home'
                    }
                }
            })
    }
})();
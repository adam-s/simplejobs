(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('myJobList', {
                url: '/job/list?limit&page&author',
                parent: 'sidebar',
                controller: 'jobListCtrl as vm',
                templateUrl: 'scripts/states/job/job.list.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        console.log('shit');
                        var job = jobApi.index($stateParams);
                        return job;
                    }]
                },
                params: {
                    limit: "10",
                    page: "1",
                    author: ['Auth', function(Auth) {
                        console.log('shit');
                        return Auth.getMe()._id;
                    }]
                },
                reloadOnSearch: false,
                data: {
                    title: 'My job listings'
                }
            })
            .state('jobEdit', {
                url: '/job/:id/edit',
                parent: 'sidebar',
                controller: 'jobDetailCtrl as vm',
                templateUrl: 'scripts/states/job/job.edit.tpl.html',
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
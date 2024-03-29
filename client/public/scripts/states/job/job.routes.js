(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('myJobList', {
                url: '/job/list?{limit:int}&{page:int}&active&jobType&email&position&author',
                parent: 'sidebar',
                controller: 'jobListCtrl as vm',
                templateUrl: 'scripts/states/job/job.list.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        var job = jobApi.index($stateParams);
                        return job;
                    }]
                },
                params: {
                    order: "-updated",
                    limit: 10,
                    page: 1,
                    author: ['Auth', function(Auth) {
                        return Auth.getMe()._id;
                    }]
                },
                reloadOnSearch: true,
                data: {
                    title: 'My job listings',
                    permissions: {
                        only: ['AUTHENTICATED'],
                        redirectTo: {
                            AUTHENTICATED: {
                                state: 'home',
                                options: { reload: true }
                            },
                            default: 'home'
                        }
                    }
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
                        only: ['AUTHENTICATED'],
                        redirectTo: {
                            AUTHENTICATED: {
                                state: 'home',
                                options: { reload: true }
                            },
                            default: 'home'
                        }
                    }
                }
            })
    }
})();
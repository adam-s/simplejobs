(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('jobList', {
                url: '/job/list?limit&page',
                parent: 'admin',
                controller: 'jobListCtrl as vm',
                templateUrl: 'scripts/states/admin/job/job.list.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        var job = jobApi.index($stateParams);
                        return job;
                    }]
                },
                params: {
                    limit: "10",
                    page: "1"
                },
                reloadOnSearch: false
            })
            .state('jobDetail', {
                url: '/job/:id/view',
                parent: 'admin',
                controller: 'jobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/job/job.detail.tpl.html'
            })
            .state('jobEdit', {
                url: '/job/:id/edit',
                parent: 'admin',
                controller: 'jobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/job/job.edit.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return jobApi.detail($stateParams.id);
                    }]
                }
            })
    }
})();
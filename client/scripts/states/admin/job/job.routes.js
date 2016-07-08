(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('adminJobList', {
                url: '/job/list?limit&page',
                parent: 'admin',
                controller: 'adminJobListCtrl as vm',
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
                reloadOnSearch: false,
                data: {
                    title: 'Job list'
                }
            })
            .state('adminJobDetail', {
                url: '/job/:id/view',
                parent: 'admin',
                controller: 'adminJobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/job/job.detail.tpl.html'
            })
            .state('adminJobEdit', {
                url: '/job/:id/edit',
                parent: 'admin',
                controller: 'adminJobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/job/job.edit.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return jobApi.detail($stateParams.id);
                    }]
                },
                data: {
                    title: 'Job edit'
                }
            })
    }
})();
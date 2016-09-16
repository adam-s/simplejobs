(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('adminJobList', {
                url: '/searchJob/list?{limit:int}&{page:int}&active&jobType&email&position&author',
                parent: 'admin',
                controller: 'adminJobListCtrl as vm',
                templateUrl: 'scripts/states/admin/searchJob/searchJob.list.tpl.html',
                resolve: {
                    job: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        var job = jobApi.index($stateParams);
                        return job;
                    }]
                },
                params: {
                    limit: {
                        value: 10
                    },
                    page: {
                        value: 1
                    }
                },
                reloadOnSearch: true,
                data: {
                    title: 'Job list'
                }
            })
            .state('adminJobDetail', {
                url: '/searchJob/:id/view',
                parent: 'admin',
                controller: 'adminJobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/searchJob/searchJob.detail.tpl.html'
            })
            .state('adminJobEdit', {
                url: '/searchJob/:id/edit',
                parent: 'admin',
                controller: 'adminJobDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/searchJob/searchJob.edit.tpl.html',
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
(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('searchJobs', {
                url: '/search/jobs?{page:int}&{limit:int}&type&position&jobType&latitude&longitude',
                parent: 'sidebar',
                controller: 'searchJobsCtrl as vm',
                templateUrl: 'scripts/states/searchJobs/searchJobs.tpl.html',
                resolve: {
                    jobs: ['$stateParams', 'jobApi', function($stateParams, jobApi) {
                        var jobs = jobApi.index($stateParams);
                        return jobs;
                    }]
                },
                params: {
                    page: {
                        value: 1
                    },
                    limit: {
                        value: 25
                    }
                },
                data: {
                    title: 'Search jobs'
                },
                reloadOnSearch: true
            })
    }
})();
(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
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
                    title: 'Job edit'
                }
            })
    }
})();
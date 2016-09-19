(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('searchResumes', {
                url: '/search/resumes?{page:int}&{limit:int}&type&position&jobType&latitude&longitude',
                parent: 'sidebar',
                controller: 'searchResumesCtrl as vm',
                templateUrl: 'scripts/states/searchResumes/searchResumes.tpl.html',
                resolve: {
                    resumes: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        return crewApi.index($stateParams);
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
                    title: 'Search resumes'
                },
                reloadOnSearch: true
            })
    }
})();
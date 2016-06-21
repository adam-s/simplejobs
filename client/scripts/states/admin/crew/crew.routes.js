(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('crewList', {
                url: '/crew/list?limit&page',
                controller: 'crewListCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.list.tpl.html',
                resolve: {
                    crew: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        var crew = crewApi.index($stateParams);
                        console.log(crew);
                        return crew;
                    }]
                },
                params: {
                    limit: "10",
                    page: "1"
                },
                reloadOnSearch: false
            })
            .state('crewDetail', {
                url: '/crew/:id/view',
                controller: 'crewDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.detail.tpl.html'
            })
            .state('crewEdit', {
                url: '/crew/:id/edit',
                controller: 'crewDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.edit.tpl.html',
                resolve: {
                    crew: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return crewApi.detail($stateParams.id);
                    }]
                }
            })
    }
})();
(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('adminCrewList', {
                url: '/crew/list?limit&page',
                parent: 'admin',
                controller: 'adminCrewListCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.list.tpl.html',
                resolve: {
                    crew: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        var crew = crewApi.index($stateParams);
                        return crew;
                    }]
                },
                params: {
                    limit: "10",
                    page: "1"
                },
                reloadOnSearch: false,
                data: {
                    title: 'Crew list'
                }
            })
            .state('adminCrewDetail', {
                url: '/crew/:id/view',
                parent: 'admin',
                controller: 'adminCrewDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.detail.tpl.html'
            })
            .state('adminCrewEdit', {
                url: '/crew/:id/edit',
                parent: 'admin',
                controller: 'adminCrewDetailCtrl as vm',
                templateUrl: 'scripts/states/profile/profile.edit.tpl.html',
                resolve: {
                    crew: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return crewApi.detail($stateParams.id);
                    }]
                },
                data: {
                    title: 'Crew edit'
                }
            })
    }
})();
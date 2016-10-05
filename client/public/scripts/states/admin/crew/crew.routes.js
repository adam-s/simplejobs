(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('adminCrewList', {
                url: '/crew/list?{limit:int}&{page:int}&active&name&location&jobType:array&position',
                parent: 'admin',
                controller: 'adminCrewListCtrl as vm',
                templateUrl: 'scripts/states/admin/crew/crew.list.tpl.html',
                resolve: {
                    crew: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
                        var crew = crewApi.index(angular.copy($stateParams));
                        return crew;
                    }]
                },
                params: {
                    limit: {
                        value: 10
                    },
                    page: {
                        value: 1
                    },
                    jobType: {
                        array: true
                    }
                },
                reloadOnSearch: true,
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
                templateUrl: 'scripts/states/admin/crew/crew.edit.tpl.html',
                resolve: {
                    profile: ['$stateParams', 'crewApi', function($stateParams, crewApi) {
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
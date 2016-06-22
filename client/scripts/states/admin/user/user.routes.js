(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('userList', {
                url: '/user/list?limit&page',
                controller: 'userListCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.list.tpl.html',
                resolve: {
                    user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                        console.log('fuck');
                        var user = userApi.index($stateParams);
                        return user;
                    }]
                },
                params: {
                    limit: "10",
                    page: "1"
                },
                reloadOnSearch: false
            })
            .state('userDetail', {
                url: '/user/:id/view',
                controller: 'userDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.detail.tpl.html'
            })
            .state('userEdit', {
                url: '/user/:id/edit',
                controller: 'userDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.edit.tpl.html',
                resolve: {
                    user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return userApi.detail($stateParams.id);
                    }]
                }
            })
    }
})();
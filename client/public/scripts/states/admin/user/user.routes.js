(function() {
    angular.module('simplejobs')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider) {
        $stateProvider
            .state('adminUserList', {
                url: '/user/list?limit&page',
                parent: 'admin',
                controller: 'adminUserListCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.list.tpl.html',
                resolve: {
                    user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                        var user = userApi.index($stateParams);
                        return user;
                    }]
                },
                params: {
                    limit: {
                        value: "10"
                    },
                    page: {
                        value: "1"
                    }
                },
                reloadOnSearch: false,
                data: {
                    title: 'User list'
                }
            })
            .state('adminUserDetail', {
                url: '/user/:id/view',
                parent: 'admin',
                controller: 'adminUserDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.detail.tpl.html'
            })
            .state('adminUserEdit', {
                url: '/user/:id/edit',
                parent: 'admin',
                controller: 'adminUserDetailCtrl as vm',
                templateUrl: 'scripts/states/admin/user/user.edit.tpl.html',
                resolve: {
                    user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                        if ($stateParams.id === 'add') {
                            return;
                        }
                        return userApi.detail($stateParams.id);
                    }]
                },
                data: {
                    title: 'User edit'
                }
            })
    }
})();
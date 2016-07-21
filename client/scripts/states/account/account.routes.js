(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('account', {
                parent: 'sidebar',
                url: '/account',
                templateUrl: 'scripts/states/account/account.tpl.html',
                controller: 'accountCtrl as vm',
                data: {
                    title: 'My Account',
                    permissions: {
                        only: ['manageAccount'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    profile: ['profileApi', function(profileApi) {
                        return profileApi.detail();
                    }],
                    jobListingCount: ['jobApi', 'Auth', function(jobApi, Auth) {
                        var userId = Auth.getMe()._id;
                        return jobApi.count(userId);
                    }]
                }
            })
            .state('email', {
                parent: 'sidebar',
                url: '/email',
                templateUrl: 'scripts/states/account/email.tpl.html',
                controller: 'emailCtrl as vm',
                data: {
                    title: 'Change Email',
                    permissions: {
                        only: ['manageAccount'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('password', {
                parent: 'sidebar',
                url: '/change-password',
                templateUrl: 'scripts/states/account/passwordChange.tpl.html',
                controller: 'passwordChangeCtrl as vm',
                data: {
                    title: 'Change password',
                    permissions: {
                        only: ['manageAccount'],
                        redirectTo: 'login'
                    }
                }
            });
    }
})();
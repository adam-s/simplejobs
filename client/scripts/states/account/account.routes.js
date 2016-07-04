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
                    title: 'My Account'
                }
            })
            .state('email', {
                parent: 'sidebar',
                url: '/email',
                templateUrl: 'scripts/states/account/email.tpl.html',
                controller: 'emailCtrl as vm',
                data: {
                    title: 'Change Email'
                }
            })
            .state('password', {
                parent: 'sidebar',
                url: '/change-password',
                templateUrl: 'scripts/states/account/passwordChange.tpl.html',
                controller: 'passwordChangeCtrl as vm',
                data: {
                    title: 'Change password'
                }
            });
    }
})();
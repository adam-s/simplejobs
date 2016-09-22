(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes ($stateProvider) {
        $stateProvider
            .state('forgotPassword', {
                parent: 'sidebar',
                url: '/forgot-password',
                templateUrl: 'scripts/states/auth/password/forgotPassword.tpl.html',
                controller: 'forgotPasswordCtrl as vm',
                data: {
                    title: 'Recover password'
                }
            })
            .state('forgotPasswordReset', {
                parent: 'sidebar',
                url: '/forgot-password-reset/:token',
                templateUrl: 'scripts/states/auth/password/forgotPasswordReset.tpl.html',
                controller: 'forgotPasswordResetCtrl as vm',
                data: {
                    title: 'Reset password'
                }
            })
    }
})();
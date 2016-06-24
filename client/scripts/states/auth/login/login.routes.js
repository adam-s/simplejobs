(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes ($stateProvider) {
        $stateProvider
            .state('login', {
                parent: 'auth',
                url: '/login',
                controller: 'LoginCtrl as vm',
                templateUrl: 'scripts/states/auth/login/login.tpl.html',
                replace: true
            })
            .state('register', {
                parent: 'auth',
                url: '/register',
                controller: 'LoginCtrl as vm',
                templateUrl: 'scripts/states/auth/login/register.tpl.html',
                replace: true
            });
    }
})();
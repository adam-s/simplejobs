(function() {
    angular.module('simplejobs')
        .config(routes)
        .run(runPhase);

    routes.$inject = ['$locationProvider', '$urlRouterProvider'];

    function routes($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get("$state");
            $state.go('home');
        });
    }

    runPhase.$inject = ['$rootScope', '$state'];

    function runPhase ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('handle me')
            event.preventDefault();
        })
    };
})();
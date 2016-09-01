(function() {
    angular.module('simplejobs')
        .config(config)
        .run(run);

    config.$inject = ['$locationProvider', '$urlRouterProvider'];

    function config($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get("$state");
            $state.go('home');
        });
    }

    run.$inject = ['$rootScope', '$window'];

    function run($rootScope, $window) {
        // $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        //     event.preventDefault();
        // })
        //
        // $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        // })
    };
})();
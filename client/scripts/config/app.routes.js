(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$locationProvider', '$urlRouterProvider'];

    function routes($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get("$state");
            $state.go('home');
        });
    }
})();
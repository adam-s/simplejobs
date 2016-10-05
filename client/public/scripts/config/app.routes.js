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

    run.$inject = ['$rootScope', '$window', '$location', '$mdDialog'];

    function run($rootScope, $window, $location, $mdDialog) {

        // https://github.com/angular/material/issues/1978
        $rootScope.$on('$locationChangeStart', function(event) {
            // Check if there is a dialog active
            var dialogs = angular.element(document).find('md-dialog');
            angular.forEach(dialogs, function() { $mdDialog.hide()})
        });

        // Let mark events to facebook pixel
        // http://stackoverflow.com/questions/26236204/facebook-custom-audience-pixel-on-singlepageapplication-spa
        // $rootScope.$on('$stateChangeSuccess', function() {
            // _fbq.push(['track', 'PixelInitialized', {}]);
        // })
    }
})();
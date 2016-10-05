(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'sidebar',
                url: '/',
                templateUrl: 'scripts/states/home/home.tpl.html',
                controller: 'homeCtrl as vm',
                data: {
                    title: 'Home'
                }
            })
    }
})();
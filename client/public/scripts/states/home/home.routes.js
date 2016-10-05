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
                    title: 'Home',
                    description: 'Why does getting a job on a yacht have to be so damn complicated?'
                }
            })
    }
})();
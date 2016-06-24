(function() {
    angular.module('simplejobs', [
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngAnimate',
        'md.data.table',
        'validation.match'
    ]);
})();

(function() {
    angular.module('simplejobs')
        .config(config);

    // @link https://materialdesignicons.com/getting-started
    config.$inject = ['$mdIconProvider'];

    function config($mdIconProvider) {
        $mdIconProvider
            .icon('facebook', 'images/icons/facebook.svg')
            .icon('google', 'images/icons/google.svg');
    }
})();
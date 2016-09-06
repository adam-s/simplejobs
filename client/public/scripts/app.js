(function() {
    angular.module('simplejobs', [
        'ui.router',
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'ngAnimate',
        'md.data.table',
        'validation.match',
        'permission',
        'permission.ui',
        'angular-loading-bar',
        'angularMoment',
        'ngFileUpload',
        'checklist-model'
    ]);
})();

(function() {
    angular.module('simplejobs')
        .config(config);

    // @link https://materialdesignicons.com/getting-started
    config.$inject = ['$mdIconProvider'];

    function config($mdIconProvider) {
        $mdIconProvider
            .icon('facebook', 'assets/icons/facebook.svg')
            .icon('google', 'assets/icons/google.svg');
    }
})();
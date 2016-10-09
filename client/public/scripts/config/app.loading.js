(function() {
    angular.module('simplejobs')
        .config(config);

    config.$inject = ['cfpLoadingBarProvider'];

    function config(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }
})();
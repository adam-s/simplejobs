(function() {
    angular.module('simplejobs')
        .config(config)
        .run(run);

    config.$inject = ['AnalyticsProvider'];
    run.$inject = ['Analytics'];

    function config(AnalyticsProvider) {
        AnalyticsProvider
            .setAccount(window.values.googleAnalyticsId)
            .setPageEvent('$stateChangeSuccess')
            .ignoreFirstPageLoad(true);
    }

    function run(Analytics) {}
})();
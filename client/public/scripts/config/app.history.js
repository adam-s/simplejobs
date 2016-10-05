(function() {
    angular.module('simplejobs')
        .run(config);
    
    config.$inject = ['$window', '$rootScope'];
    /**
     * Pulled this idea for a way to go back to previous state
     * @link http://stackoverflow.com/a/27349525
     *
     * @param $window
     * @param $rootScope
     */
    function config($window, $rootScope) {
        $rootScope.goBack = function() {
            $window.history.back();
        }
    }
})();
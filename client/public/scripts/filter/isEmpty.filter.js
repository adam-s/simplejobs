(function() {
    // @link http://stackoverflow.com/a/30367096/494664

    angular.module('simplejobs')
        .filter('isEmpty', isEmpty);

    isEmpty.$inject = [];

    function isEmpty() {
        return function(input) {
            return angular.equals({}, input);
        }
    }
})();
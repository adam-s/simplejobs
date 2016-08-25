(function() {
    angular.module('simplejobs')
        .filter('fileName', fileName);

    fileName.$inject = [];

    function fileName() {
        return function (input) {
            return input.substr(input.lastIndexOf('/') + 1);
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .filter('trim', trim);

    trim.$inject = [];

    function trim() {
        return function(data) {
            if (!data) return data;
            return data.trim();
        };
    }
})();
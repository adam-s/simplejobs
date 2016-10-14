(function() {
    angular.module('simplejobs')
        .filter('escapeURI', escapeURI);

    escapeURI.$inject = [];

    function escapeURI() {
        return window.encodeURIComponent;
    }
})();
(function() {
    angular.module('simplejobs')
        .factory('userApi', userApi);

    userApi.$inject = ['RestApi'];

    var endpoint = '/api/users/';

    function userApi(RestApi) {
        return RestApi(endpoint);
    }
})();
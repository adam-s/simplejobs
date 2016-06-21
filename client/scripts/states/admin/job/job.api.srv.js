(function() {
    angular.module('simplejobs')
        .factory('jobApi', jobApi);

    jobApi.$inject = ['RestApi'];

    var endpoint = '/api/job-listings/';

    function jobApi(RestApi) {
        return RestApi(endpoint);
    }
})();
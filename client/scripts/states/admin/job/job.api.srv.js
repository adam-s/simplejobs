(function() {
    angular.module('simplejobs')
        .factory('jobApi', jobApi);

    jobApi.$inject = ['RestApi'];

    var endpoint = '/api/job-listings/';

    function jobApi(RestApi) {
        console.log('jobApi');
        return RestApi(endpoint);
    }
})();
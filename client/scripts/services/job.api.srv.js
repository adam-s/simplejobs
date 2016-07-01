(function() {
    angular.module('simplejobs')
        .factory('jobApi', jobApi);

    jobApi.$inject = ['RestApi'];

    var endpoint = '/api/job-listings/';
    // The paradigm for ES5 inheritance.
    // @link http://stackoverflow.com/questions/15192722/javascript-extending-class
    function jobApi(RestApi) {
        return new RestApi(endpoint);
    }
})();
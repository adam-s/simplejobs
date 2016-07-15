(function() {
    angular.module('simplejobs')
        .factory('jobApi', jobApi);

    jobApi.$inject = ['RestApi'];

    var endpoint = '/api/job-listings/';
    // The paradigm for ES5 inheritance.
    // @link http://stackoverflow.com/questions/15192722/javascript-extending-class
    function jobApi(RestApi) {
        function JobApi (endpoint) {
            RestApi.call(this, endpoint)
        }

        JobApi.prototype = Object.create(JobApi.prototype);

        JobApi.prototype.constructor = JobApi;

        JobApi.prototype.count = function(userId) {
            var deferred = $q.defer();

            $http.({
                method: 'GET',
                url: endpoint + 'count',
                params: {
                    userId: userId
                }
            })
                .then(function success(response) {
                return response.data
            }, function error(response) {
                return response.data;
            });

            return deferred.promise;
        };

        return new JobApi(endpoint);
    }
})();
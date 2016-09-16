(function() {
    angular.module('simplejobs')
        .factory('jobApi', jobApi);

    jobApi.$inject = ['RestApi', '$http', '$q'];

    var endpoint = '/api/job-listings/';
    // The paradigm for ES5 inheritance.
    // @link http://stackoverflow.com/questions/15192722/javascript-extending-class
    function jobApi(RestApi, $http, $q) {
        function JobApi (endpoint) {
            RestApi.call(this, endpoint);
        }

        JobApi.prototype = Object.create(RestApi.prototype);

        JobApi.prototype.constructor = JobApi;

        JobApi.prototype.count = function(userId) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: endpoint + 'count',
                params: {
                    userId: userId
                }
            })
            .then(function success(response) {
                deferred.resolve(response.data)
            }, function error(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        JobApi.prototype.autocomplete = function autocomplete(field, query) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: endpoint + 'autocomplete/' + field + '?q=' + query
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                deferred.reject(response.data)
            });

            return deferred.promise;
        };

        return new JobApi(endpoint);
    }
})();
(function() {
    angular.module('simplejobs')
        .factory('crewApi', crewApi);

    crewApi.$inject = ['RestApi', 'Upload', '$http', '$q'];

    var endpoint = '/api/crew-listings/';

    function crewApi(RestApi, Upload, $http, $q) {
        function CrewApi(endpoint) {
            RestApi.call(this, endpoint);
        }

        CrewApi.prototype = Object.create(RestApi.prototype);

        CrewApi.prototype.constructor = CrewApi;

        CrewApi.prototype.create = function create(model, file) {
            var deferred = $q.defer();

            Upload.upload({
                url: endpoint,
                method: 'POST',
                data: model
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        CrewApi.prototype.update = function update(model, file) {
            var deferred = $q.defer();

            Upload.upload({
                url: endpoint + model._id,
                method: 'PUT',
                data: model
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        return new CrewApi(endpoint);
    }
})();
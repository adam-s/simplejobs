(function() {
    angular.module('simplejobs')
        .factory('profileApi', profileApi);

    profileApi.$inject = ['RestApi', 'Upload', '$http', '$q'];

    var endpoint = '/api/profile/';

    function profileApi(RestApi, Upload, $http, $q) {
        function ProfileApi(endpoint) {
            RestApi.call(this, endpoint);
        }

        ProfileApi.prototype = Object.create(RestApi.prototype);

        ProfileApi.prototype.constructor = ProfileApi;

        ProfileApi.prototype.detail = function detail(userId) {
            var deferred = $q.defer();
            var detailEndpoint = endpoint;
            if (userId) {
                detailEndpoint = endpoint + userId;
            }

            $http.get(detailEndpoint)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        };

        ProfileApi.prototype.create = function create(model, file) {
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

        ProfileApi.prototype.update = function update(model) {
            var deferred = $q.defer();

            Upload.upload({
                url: endpoint,
                method: 'PUT',
                data: model
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        return new ProfileApi(endpoint);
    }
})();
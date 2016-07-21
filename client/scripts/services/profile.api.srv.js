(function() {
    angular.module('simplejobs')
        .factory('profileApi', profileApi);

    profileApi.$inject = ['$http', '$q'];

    var endpoint = '/api/profile/';

    function profileApi($http, $q) {
        return {
            detail: detail,
            create: create,
            update: update,
            remove: remove
        };

        function detail(userId) {
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
        }

        function create(model) {
            var deferred = $q.defer();

            $http
                .post(endpoint, model)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        }

        function update(model) {
            var deferred = $q.defer();

            $http
                .put(endpoint, model)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        }

        function remove() {
            var deferred = $q.defer();

            $http
                .delete(endpoint)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });


            return deferred.promise;
        }
    }
})();
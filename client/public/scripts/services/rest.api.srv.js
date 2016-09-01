(function() {
    angular.module('simplejobs')
        .factory('RestApi', RestApi);

    RestApi.$inject = ['$http', '$q'];

    function RestApi($http, $q) {

        function Route(endpoint) {
            this.endpoint = endpoint;
        }

        Route.prototype.index = function index(tableState) {
            var deferred = $q.defer();

            $http({
                url: this.endpoint,
                method: 'GET',
                params: {tableState: tableState},
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        Route.prototype.detail = function detail(id) {
            var deferred = $q.defer();

            $http
                .get(this.endpoint + id)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        };

        Route.prototype.create = function create(model) {
            var deferred = $q.defer();

            $http
                .post(this.endpoint, model)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        };

        Route.prototype.update = function update(model) {
            var deferred = $q.defer();

            $http
                .put(this.endpoint + model._id, model)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        };

        Route.prototype.remove = function remove(id) {
            var deferred = $q.defer();

            $http
                .delete(this.endpoint + id)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(response) {
                    deferred.reject(response.data);
                });

            return deferred.promise;
        };

        return Route;
    }

})();
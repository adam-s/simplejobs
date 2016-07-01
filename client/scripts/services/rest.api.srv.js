(function() {
    angular.module('simplejobs')
        .factory('RestApi', RestApi);

    RestApi.$inject = ['$http'];

    function RestApi($http) {

        function Route(endpoint) {
            this.endpoint = endpoint;
        }

        Route.prototype.index = function index(tableState) {
            return $http({
                    url: this.endpoint,
                    method: 'GET',
                    params: {tableState: tableState},
                    paramSerializer: '$httpParamSerializerJQLike'
                })
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return response.data;
                });
        };

        Route.prototype.detail = function detail(id) {
            return $http
                .get(this.endpoint + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return response.data;
                });
        };

        Route.prototype.create = function create(model) {
            return $http
                .post(this.endpoint, model)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return response.data;
                });
        };

        Route.prototype.update = function update(model) {
            return $http
                .put(this.endpoint + model._id, model)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return response.data;
                });
        };

        Route.prototype.remove = function remove(id) {
            return $http
                .delete(this.endpoint + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return response.data;
                })
        };

        return Route;
    }

})();
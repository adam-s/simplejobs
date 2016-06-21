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
                .then(getData);
        };

        Route.prototype.detail = function detail(id) {
            return $http
                .get(this.endpoint + id)
                .then(getData);
        };

        Route.prototype.create = function create(model) {
            return $http
                .post(this.endpoint, model)
                .then(getData);
        };

        Route.prototype.update = function update(model) {
            return $http
                .put(this.endpoint + model._id, model)
                .then(getData);
        };

        Route.prototype.remove = function remove(id) {
            return $http
                .delete(this.endpoint + id)
                .then(getData)
        };

        return function(endpoint) {
            return new Route(endpoint);
        };

        function getData(response) {
            return response.data.data
        }
    }

})();
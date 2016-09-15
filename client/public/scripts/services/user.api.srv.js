(function() {
    angular.module('simplejobs')
        .factory('userApi', userApi);

    userApi.$inject = ['RestApi', '$http', '$q'];

    var endpoint = '/api/users/';

    function userApi(RestApi, $http, $q) {
        function UserApi(endpoint) {
            RestApi.call(this, endpoint);
        }

        UserApi.prototype = Object.create(RestApi.prototype);

        UserApi.prototype.contructor = UserApi;

        UserApi.prototype.autocomplete = function autocomplete(field, query) {
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

        return new UserApi(endpoint);
    }
})();
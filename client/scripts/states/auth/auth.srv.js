(function() {
    angular.module('simplejobs')
        .factory('Auth', Auth);

    Auth.$inject = ['$window', '$http', '$q'];

    function Auth($window, $http, $q) {
        var me = $window.me;

        return {
            me: me,
            register: register,
            login: login
        };

        function register(credentials) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'api/auth/register',
                data: credentials
            }).success(function(response) {
                me = response;
                deferred.resolve();
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function login(credentials) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'api/auth/login',
                data: credentials
            }).success(function(response) {
                me = response;
                deferred.resolve();
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }
})();
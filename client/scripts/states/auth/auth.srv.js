(function() {
    angular.module('simplejobs')
        .factory('Auth', Auth);

    Auth.$inject = ['$window', '$http', '$q', '$state'];

    function Auth($window, $http, $q, $state) {
        var me = $window.me;

        return {
            getMe: getMe,
            register: register,
            login: login,
            logout: logout
        };

        function getMe() {
            return me;
        }

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

        function logout() {
            $http({
                method: 'GET',
                url: 'api/auth/logout'
            }).then(function() {
                me = "";
                $state.go('home');
            })
        }
    }
})();
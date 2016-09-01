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
            logout: logout,
            email: email,
            passwordChange: passwordChange,
            hasRole: hasRole
        };

        function getMe() {
            return me;
        }

        function register(credentials) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/auth/register',
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
                url: '/auth/login',
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
                url: '/auth/logout'
            }).then(function() {
                me = "";
                $state.go('home');
            })
        }

        function email(credentials) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/auth/email',
                data: credentials
            }).success(function(response) {
                //me = response;
                deferred.resolve();
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function passwordChange(credentials) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/auth/change-password',
                data: credentials
            }).success(function(response) {
                //me = response;
                deferred.resolve();
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function hasRole(rollToCheck) {
            var roles = me.roles || [];
            return roles.some(function(role) {
                return role === rollToCheck;
            });
        }
    }
})();
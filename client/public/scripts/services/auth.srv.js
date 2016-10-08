(function() {
    angular.module('simplejobs')
        .factory('Auth', Auth);

    Auth.$inject = ['$window', '$http', '$q', '$state'];

    function Auth($window, $http, $q, $state) {
        var me = $window.me;

        return {
            getMe: getMe,
            setMe: setMe,
            fetchMe: fetchMe,
            register: register,
            login: login,
            logout: logout,
            email: email,
            passwordChange: passwordChange,
            forgotPassword: forgotPassword,
            forgotPasswordReset: forgotPasswordReset,
            hasRole: hasRole,
            isLoggedIn: isLoggedIn
        };

        function setMe(user) {
            me = user;
        }
        function getMe() {
            return me;
        }

        function fetchMe() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/auth/me'
            }).success(function(response) {
                if (response._id) {
                    me = window.me = response;
                } else {
                    me = window.me = '';
                }
                deferred.resolve(response)
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
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
                me = window.me = response;
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
                me = window.me = "";
                $state.go('home',{}, {reload: true});
            })
        }

        function email(credentials) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/auth/email',
                data: credentials
            }).success(function(response) {
                me = response;
                deferred.resolve(response);
            }).error(function(response) {
                console.log(response);
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
                me = response;
                deferred.resolve();
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function forgotPassword(email) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/auth/forgot-password',
                data: {email: email}
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function forgotPasswordReset(body) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/auth/forgot-password-reset',
                data: body
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function hasRole(rollToCheck) {
            var roles = me.roles || [];
            return roles.some(function(role) {
                console.log(role);
                return role === rollToCheck;
            });
        }

        function isLoggedIn() {
            return hasRole('authenticated')
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .config(config);

    config.$inject = ['$httpProvider'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor')
    }
})();

(function() {
    angular.module('simplejobs')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$injector'];

    function authInterceptor($q, $injector) {
        return {
            'responseError': function(errorResponse) {
                var Auth = $injector.get('Auth');
                var $state = $injector.get('$state');
                var loginService = $injector.get('loginService');
                var $mdDialog = $injector.get('$mdDialog');

                switch(errorResponse.status) {

                    // Here we should make a request to '/auth/me' to receive the most current user object.
                    // The 401 should present the user with a login to give them an opportunity to have access
                    // within context.

                    // Facebook polls 30s to see if the user has each opened instance authenticated.
                    case 401:
                        console.log('Not authenticated');
                        Auth.fetchMe()
                            .then(function(response) {
                                console.log(response);
                                $state.go('.', {}, {reload: true});
                            });
                        break;

                    case 403:
                        console.log('Access denied');
                        Auth.fetchMe()
                            .then(function(response) {
                                console.log(response);
                                $state.go('.', {}, {reload: true});
                            });
                        break;
                }

                return $q.reject(errorResponse);
            }
        }
    }
})();
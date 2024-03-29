(function() {
    angular.module('simplejobs')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('profileEdit', {
                url: '/profile/edit',
                parent: 'sidebar',
                controller: 'profileEditCtrl as vm',
                templateUrl: 'scripts/states/profile/profile.edit.tpl.html',
                resolve: {
                    profile: ['profileApi', function(profileApi) {
                        var profile = profileApi.detail();
                        return profile;
                    }]
                },
                data: {
                    title: 'My resume profile',
                    permissions: {
                        only: ['AUTHENTICATED'],
                        redirectTo: {
                            AUTHENTICATED: {
                                state: 'home',
                                options: { reload: true }
                            },
                            default: 'home'
                        }
                    }
                }
            })
    }
})();
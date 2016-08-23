(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermRoleStore', 'Auth'];

    function policies(PermRoleStore, Auth) {
        PermRoleStore
            .defineRole('ADMINISTRATOR', function(roleName, transitionProperties) {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                    return role === 'administrator';
                })
            })
    }
})();
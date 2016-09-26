(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermRoleStore', 'PermPermissionStore', 'Auth'];

    function policies(PermRoleStore, PermPermissionStore, Auth) {

        PermRoleStore
            .defineRole('ADMINISTRATOR', function(roleName, transitionProperties) {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                    return role === 'administrator';
                })
            });


        PermRoleStore
            .defineRole('AUTHENTICATED', function(roleName, transitionProperties) {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                    return role === 'authenticated';
                })
            });

        PermPermissionStore
            .definePermission('manageOwnAccount', function() {
                var roles = Auth.getMe().roles || [];
                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });
    }
})();
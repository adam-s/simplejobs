(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermRoleStore', 'PermPermissionStore', 'Auth'];

    function policies(PermRoleStore, PermPermissionStore, Auth) {

        PermRoleStore
            .defineRole('ADMINISTRATOR', function() {
                var user = Auth.getMe();
                if (!user) return false;

                var roles = user.roles || [];

                return roles.some(function(role) {
                    return role === 'administrator';
                })
            });


        PermRoleStore
            .defineRole('AUTHENTICATED', function() {
                var user = Auth.getMe();
                if (!user) return false;

                var roles = user.roles || [];

                return roles.some(function(role) {
                    return role === 'authenticated';
                })
            });

        PermPermissionStore
            .definePermission('manageOwnAccount', function() {
                var user = Auth.getMe();
                if (!user) return false;

                var roles = user.roles || [];

                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });
    }
})();
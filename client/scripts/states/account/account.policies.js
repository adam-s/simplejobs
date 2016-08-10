(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermRoleStore', 'PermPermissionStore', 'Auth'];

    function policies(PermRoleStore, PermPermissionStore, Auth) {

        PermPermissionStore
            .definePermission('manageAccount', function() {
                console.log('permission');
                var roles = Auth.getMe().roles || [];
                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });

        PermRoleStore
            .defineRole('authenticated', ['manageAccount']);
    }
})();
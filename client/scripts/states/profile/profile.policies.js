(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['RoleStore', 'PermissionStore', 'Auth'];

    function policies(RoleStore, PermissionStore, Auth) {

        PermissionStore
            .definePermission('editProfile', function() {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });

        RoleStore
            .defineRole('authenticated', ['editProfile'])
    }
})();
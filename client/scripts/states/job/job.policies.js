(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['RoleStore', 'PermissionStore', 'Auth'];

    function policies(RoleStore, PermissionStore, Auth) {

        var roles = Auth.getMe().roles || [];

        PermissionStore
            .definePermission('addJob', function () {
                return roles.some(function(role) {
                   return role === 'authenticated';
                });
            });

        RoleStore
            .defineRole('authenticated', ['addJob'])
    }
})();
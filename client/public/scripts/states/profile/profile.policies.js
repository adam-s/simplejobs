(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['Auth', 'PermPermissionStore'];

    function policies(Auth, PermPermissionStore) {

        PermPermissionStore
            .definePermission('editProfile', function() {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });
    }
})();
(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['Auth', 'PermPermissionStore'];

    function policies(Auth, PermPermissionStore) {

        PermPermissionStore
            .definePermission('editProfile', function() {
                var user = Auth.getMe();
                if (!user) return false;

                var roles = user.roles || [];


                return roles.some(function(role) {
                    return role === 'authenticated';
                });
            });
    }
})();
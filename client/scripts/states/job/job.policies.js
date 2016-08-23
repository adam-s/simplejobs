(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermPermissionStore', 'Auth'];

    function policies(PermPermissionStore, Auth) {

        PermPermissionStore
            .definePermission('addJob', function () {
                var roles = Auth.getMe().roles || [];

                return roles.some(function(role) {
                   return role === 'authenticated';
                });
            });
}
})();
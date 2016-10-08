(function() {
    angular.module('simplejobs')
        .run(policies);

    policies.$inject = ['PermPermissionStore', 'Auth'];

    function policies(PermPermissionStore, Auth) {

        PermPermissionStore
            .definePermission('addJob', function () {
                var user = Auth.getMe();
                if (!user) return false;

                var roles = user.roles || [];


                return roles.some(function(role) {
                   return role === 'authenticated';
                });
            });
}
})();
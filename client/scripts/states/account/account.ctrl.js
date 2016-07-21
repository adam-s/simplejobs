(function() {
    angular.module('simplejobs')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$mdToast', 'profileApi', 'profile', 'jobListingCount', 'errorHandler'];

    function accountCtrl($mdToast, profileApi, profile, jobListingCount, errorHandler) {
        var vm = this;
        vm.profile = profile;
        vm.jobListingCount = jobListingCount;
        vm.toggleProfileButtonDisabled = false;
        vm.toggleProfile = function() {
            vm.toggleProfileButtonDisabled = true;
            profile.active = !profile.active;
            profileApi
                .update(profile)
                .then(function() {
                    vm.toggleProfileButtonDisabled = false;
                    var toast = $mdToast.simple().textContent('Profile is updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response, function() {
                        vm.toggleProfileButtonDisabled = false;
                        profile.active = !profile.active;
                    })
                });
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$scope', '$timeout', '$mdToast', 'profileApi', 'profile', 'jobListingCount', 'errorHandler'];

    function accountCtrl($scope, $timeout, $mdToast, profileApi, profile, jobListingCount, errorHandler) {
        var vm = this;
        vm.profile = profile;
        vm.jobListingCount = jobListingCount;
        vm.toggleProfileButtonDisabled = false;
        vm.checkInButtonDisabled = false;

        vm.toggleProfile = toggleProfile;
        vm.checkIn = checkIn;

        $scope.$watch(function() {
            return profile.checkIn
        }, function() {
            // if the difference is less than 24 hours or (1000 * 60 * 60 *24) the add to now
            if (profile) {
                if (profile.checkIn) {
                    var current = new Date();
                    var checkIn = new Date(profile.checkIn);
                    var twentyFour = 1000 * 60 * 60 * 24;
                    var difference =  Math.abs(current - checkIn);
                    console.log(current.getTime());
                    console.log(checkIn.getTime() + twentyFour);
                    if (current.getTime() <= checkIn.getTime() + twentyFour) {
                        $timeout(function() {
                            vm.timeToCheckIn = 0;
                        }, difference + twentyFour);
                        vm.timeToCheckIn = new Date(current - difference + twentyFour);
                    } else {
                        vm.timeToCheckIn = 0;
                    }
                }
            }
        });

        function toggleProfile() {
            vm.toggleProfileButtonDisabled = true;
            profile.active = !profile.active;
            profileApi
                .update(profile)
                .then(function(response) {
                    vm.toggleProfileButtonDisabled = false;
                    vm.profile = profile = response;
                    var toast = $mdToast.simple().textContent('Profile is updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response, function() {
                        vm.toggleProfileButtonDisabled = false;
                        profile.active = !profile.active;
                    })
                });
        }

        function checkIn() {
            vm.checkInButtonDisabled = true;
            profileApi
                .update(profile)
                .then(function(response) {
                    vm.checkInButtonDisabled = false;
                    vm.profile = profile = response;
                    var toast = $mdToast.simple().textContent('Profile is updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response, function() {
                        vm.checkInButtonDisabled = false;
                    })
                });
        }
    }
})();
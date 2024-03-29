(function() {
    angular.module('simplejobs')
        .controller('profileEditCtrl', profileEditCtrl);

    profileEditCtrl.$inject = ['$scope', '$mdToast', 'Auth', '$state', 'profileApi', 'profile', 'errorHandler', 'sjLogger'];

    function profileEditCtrl($scope, $mdToast, Auth, $state, profileApi, profile, errorHandler, sjLogger) {
        var vm = this;
        var user = Auth.getMe();
        var newProfile = !profile;

        // Only edit own here because angular permission module doesn't wait for resolved object ;(
        if (profile && profile.author !== user._id) {
            $state.go('home');
        }

        vm.profile = profile || {
            active: true,
            startDate: new Date()
        };

        if (typeof vm.profile.startDate === 'string') {
            // ISO 8601 Date Pattern: YYYY-mm-ddThh:MM:ss
            // @link http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
            var dateMatchPattern = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
            if (dateMatchPattern.test(vm.profile.startDate)) {
                vm.profile.startDate = new Date(vm.profile.startDate);
            }
        }

        $scope.$watch('vm.profile.file', function(file) {
            if (file) {
                vm.profile.resume = file.name || '';
            }
        });

        vm.submitDisabled = false;
        vm.submit = function() {
            vm.submitDisabled = true;
            var submitFn = newProfile ? profileApi.create.bind(profileApi) : profileApi.update.bind(profileApi);
            submitFn(vm.profile)
                .then(function() {

                    // Don't want to be passing private variables around to third party scripts. That is interesting :/
                    // Probably an anti-pattern
                    sjLogger.logEvent({
                        action: 'EditListing',
                        category: 'Resume',
                        jobType: angular.copy(vm.profile.jobType),
                        position: angular.copy(vm.profile.position),
                        locationName: angular.copy(vm.profile.location.name),
                        vesselType: angular.copy(vm.profile.vesselType)
                    });

                    newProfile = false;
                    vm.submitDisabled = false;

                    var toast = $mdToast.simple().textContent('Your profile is updated');
                    $mdToast.show(toast);
                }, function(response) {
                    vm.submitDisabled = false;
                    errorHandler.handleValidationErrors(response);
                })
        };

        vm.setDirty = function(event) {
            console.log(event);console.log(this);

            this.$setDirty();
        }

    }
})();
(function() {
    angular.module('simplejobs')
        .controller('profileEditCtrl', profileEditCtrl);

    profileEditCtrl.$inject = ['$mdToast', 'Auth', '$state', 'profileApi', 'profile', 'errorHandler'];

    function profileEditCtrl($mdToast, Auth, $state, profileApi, profile, errorHandler) {
        var vm = this;
        var user = Auth.getMe();

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

        vm.submitDisabled = false;
        vm.submit = function() {
            vm.submitDisabled = true;
            var submitFn = !profile ? profileApi.create.bind(profileApi) : profileApi.update.bind(profileApi);
            submitFn(vm.profile)
                .then(function() {
                    vm.submitDisabled = false;
                    var toast = $mdToast.simple().textContent('Your profile is updated');
                    $mdToast.show(toast);
                }, function(response) {
                    vm.submitDsiabled = false;
                    errorHandler.handleValidationErrors(response);
                })
        }

    }
})();
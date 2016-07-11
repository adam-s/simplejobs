(function() {
    angular.module('simplejobs')
        .controller('jobDetailCtrl', jobDetailCtrl);

    jobDetailCtrl.$inject = ['$mdDialog', '$state', 'jobApi', 'job', 'Auth'];

    function jobDetailCtrl($mdDialog, $state, jobApi, job, Auth) {
        var vm = this;
        var user = Auth.getMe();

        // Should only be able to edit if owner can't do this at policy level because job isn't loaded
        // Decided to not cloud up the resolve router parameter either.
        if (job && job.author !== user._id) {
            $state.go('home');
        }

        vm.job = job || {
            active: true,
            startDate: new Date(),
            email: angular.copy(user.email)
        };

        // Initialize date object;
        // @link http://stackoverflow.com/questions/33017677/angular-ui-date-picker-is-in-invalid-state-when-specified-the-date-format-as-d
        if (typeof vm.job.startDate === 'string') {
            // ISO 8601 Date Pattern: YYYY-mm-ddThh:MM:ss
            // @link http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
            var dateMatchPattern = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
            if (dateMatchPattern.test(vm.job.startDate)) {
                vm.job.startDate = new Date(vm.job.startDate);
            }
        }

        //vm.job = job || {
        //    active: true,
        //    position: 'Captain',
        //    jobType: 'Sailing',
        //    location:  {
        //        name: 'Newport',
        //        location: {
        //            locality: 'Newport',
        //            district: 'Newport County',
        //            administrativeArea: 'Rhode Island',
        //            country: 'United States',
        //            coordinates: [-71.3128290, 41.4901020]
        //        }
        //    }
        //};


        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof job === 'undefined');
            var submitFn = add ? jobApi.create.bind(jobApi) : jobApi.update.bind(jobApi);
            submitFn(vm.job)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('jobEdit', {id: response._id});
                }, function(response) {
                    handleValidationErrors(response)
                    vm.submitDisabled = false;
                });
        };


        function handleValidationErrors(response) {
            var alert;

            if (response.message === 'Validation error') {
                if (response.errors) {
                    var content = response.errors.reduce(function(string, value) {
                        console.log(value); console.log(string);
                        return string + '<li>' + value.msg + '</li>';
                    }, '');

                    alert = $mdDialog.alert({
                        title: response.message,
                        htmlContent: '<ul>' + content + '</ul>',
                        ok: 'Close'
                    });
                }
            } else if (response.message) {
                alert = $mdDialog.alert({
                    title: response.message,
                    ok: 'Close'
                })
            }

            $mdDialog
                .show(alert)
                .finally(function() {
                    alert = undefined;
                });
        }
    }
})();
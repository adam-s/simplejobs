(function() {
    angular.module('simplejobs')
        .controller('adminJobDetailCtrl', adminJobDetailCtrl);

    adminJobDetailCtrl.$inject = ['$mdToast', '$state', 'jobApi', 'job', 'errorHandler'];

    function adminJobDetailCtrl($mdToast, $state, jobApi, job, errorHandler) {
        var vm = this;

        vm.job = job || {
                active: true,
                startDate: new Date()
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

        vm.submitDisabled = false;

        vm.submit = function() {
            vm.submitDisabled = true;
            var add = (typeof job === 'undefined');
            var submitFn = add ? jobApi.create.bind(jobApi) : jobApi.update.bind(jobApi);
            console.log(vm.job);
            submitFn(vm.job)
                .then(function(response) {
                    vm.submitDisabled = false;
                    $state.go('adminJobEdit', {id: response._id});
                    var toast = $mdToast.simple().textContent('Job listing updated');
                    $mdToast.show(toast);
                }, function(response) {
                    errorHandler.handleValidationErrors(response);
                    vm.submitDisabled = false;
                });
        };
    }
})();
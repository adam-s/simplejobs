(function() {
    angular.module('simplejobs')
        .controller('jobDetailCtrl', jobDetailCtrl);

    jobDetailCtrl.$inject = ['$window', '$scope', '$state', 'jobApi', 'job', 'Auth'];

    function jobDetailCtrl($window, $scope, $state, jobApi, job, Auth) {
        var vm = this;
        vm.job = job || {
            active: true,
            startDate: new Date(),
            email: angular.copy(Auth.getMe().email)
        };
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
                    vm.submitDisabled = false;
                });
        };
    }
})();
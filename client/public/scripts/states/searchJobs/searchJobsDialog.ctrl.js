(function() {
    angular.module('simplejobs')
        .controller('searchJobsDialogCtrl', searchJobsDialogCtrl);

    searchJobsDialogCtrl.$inject = ['$window', '$mdDialog', 'Analytics', 'job'];

    function searchJobsDialogCtrl($window, $mdDialog, Analytics, job) {
        var dialog = this;

        dialog.job = job;

        // Track what people are looking at
        Analytics.trackEvent('Job', 'view', job._id, 1, false, {
            dimension1: job.position,
            dimension2: job.jobType
        });

        $window._fbq.push(['track', 'ViewListing', {
            kind: 'Job',
            position: job.position,
            jobType: job.jobType
        }]);

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
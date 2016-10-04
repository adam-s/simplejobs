(function() {
    angular.module('simplejobs')
        .controller('searchJobsDialogCtrl', searchJobsDialogCtrl);

    searchJobsDialogCtrl.$inject = ['$mdDialog', 'Analytics', 'job'];

    function searchJobsDialogCtrl($mdDialog, Analytics, job) {
        var dialog = this;

        dialog.job = job;

        Analytics.trackEvent('Job', 'view', job._id, 1, false, {
            dimension1: job.position,
            dimension2: job.jobType
        });

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
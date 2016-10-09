(function() {
    angular.module('simplejobs')
        .controller('searchJobsDialogCtrl', searchJobsDialogCtrl);

    searchJobsDialogCtrl.$inject = ['$mdDialog', 'job', 'sjLogger'];

    function searchJobsDialogCtrl($mdDialog, job, sjLogger) {
        var dialog = this;

        dialog.job = job;

        sjLogger.logEvent({
            action: 'ViewListing',
            category: 'Job',
            jobType: job.jobType,
            position: job.position,
            locationName: job.location.name,
            vesselType: job.vesselType
        });

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
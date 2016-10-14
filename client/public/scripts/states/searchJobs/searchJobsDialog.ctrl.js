(function() {
    angular.module('simplejobs')
        .controller('searchJobsDialogCtrl', searchJobsDialogCtrl);

    searchJobsDialogCtrl.$inject = ['$mdDialog', 'loginService', 'job', 'sjLogger'];

    function searchJobsDialogCtrl($mdDialog, loginService, job, sjLogger) {
        var dialog = this;

        dialog.job = job;
        dialog.login = loginService.open;

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
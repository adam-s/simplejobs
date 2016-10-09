(function() {
    angular.module('simplejobs')
        .controller('searchResumesDialogCtrl', searchResumesDialogCtrl);

    searchResumesDialogCtrl.$inject = ['$mdDialog', 'resume', 'sjLogger'];

    function searchResumesDialogCtrl($mdDialog, resume, sjLogger) {
        var dialog = this;

        dialog.resume = resume;

        sjLogger.logEvent({
            action: 'ViewListing',
            category: 'Resume',
            jobType: resume.jobType,
            position: resume.position,
            locationName: resume.location.name,
            vesselType: resume.vesselType
        });

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };

        dialog.trackDownload = function() {
            sjLogger.logEvent({
                action: 'DownloadResume',
                category: 'Resume',
                jobType: resume.jobType,
                position: resume.position,
                locationName: resume.location.name,
                vesselType: resume.vesselType
            });
        };

        dialog.downloadFile = function(uri) {
            $window.open(uri, 'Download');
        };
    }
})();
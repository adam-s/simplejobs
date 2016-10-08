(function() {
    angular.module('simplejobs')
        .controller('searchResumesDialogCtrl', searchResumesDialogCtrl);

    searchResumesDialogCtrl.$inject = ['$window', '$mdDialog', 'Analytics', 'resume'];

    function searchResumesDialogCtrl($window, $mdDialog, Analytics, resume) {
        var dialog = this;

        dialog.resume = resume;

        Analytics.trackEvent('ViewListing', 'view', 'Resume', 1, false, {
            dimension1: resume.position,
            dimension2: resume.jobType
        });

        $window.fbq('trackCustom', 'ViewListing', {
            kind: 'Resume',
            position: resume.position,
            jobType: resume.jobType
        });

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };

        dialog.downloadFile = function(uri) {
            $window.open(uri, 'Download');
        };
    }
})();
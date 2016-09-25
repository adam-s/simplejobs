(function() {
    angular.module('simplejobs')
        .controller('searchResumesDialogCtrl', searchResumesDialogCtrl);

    searchResumesDialogCtrl.$inject = ['$window', '$mdDialog', 'resume'];

    function searchResumesDialogCtrl($window, $mdDialog, resume) {
        var dialog = this;

        dialog.resume = resume;

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
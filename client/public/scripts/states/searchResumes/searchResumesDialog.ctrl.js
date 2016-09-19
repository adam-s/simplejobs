(function() {
    angular.module('simplejobs')
        .controller('searchResumesDialogCtrl', searchResumesDialogCtrl);

    searchResumesDialogCtrl.$inject = ['$mdDialog', 'resume'];

    function searchResumesDialogCtrl($mdDialog, resume) {
        var dialog = this;

        dialog.resume = resume;

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
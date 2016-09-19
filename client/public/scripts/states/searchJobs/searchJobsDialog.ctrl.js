(function() {
    angular.module('simplejobs')
        .controller('searchJobsDialogCtrl', searchJobsDialogCtrl);

    searchJobsDialogCtrl.$inject = ['$mdDialog', 'job'];

    function searchJobsDialogCtrl($mdDialog, job) {
        var dialog = this;

        dialog.job = job;

        dialog.close = function() {
            $mdDialog.hide();
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
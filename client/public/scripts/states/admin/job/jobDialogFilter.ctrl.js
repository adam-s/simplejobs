(function() {
    angular.module('simplejobs')
        .controller('jobDialogFilterCtrl', jobDialogFilterCtrl);

    jobDialogFilterCtrl.$inject = ['tableState', '$mdDialog', 'jobApi'];

    function jobDialogFilterCtrl(tableState, $mdDialog, jobApi) {
        var dialog = this;
        dialog.tableState = tableState;

        dialog.close = function() {
            dialog.tableState.page = 1;
            $mdDialog.hide(dialog.tableState);
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };

        dialog.querySearch = function (field, query) {
            return jobApi.autocomplete(field, query);
        };
    }
})();
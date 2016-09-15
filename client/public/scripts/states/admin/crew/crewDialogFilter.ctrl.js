(function() {
    angular.module('simplejobs')
        .controller('crewDialogFilterCtrl', crewDialogFilterCtrl);

    crewDialogFilterCtrl.$inject = ['tableState', '$mdDialog', 'crewApi'];

    function crewDialogFilterCtrl(tableState, $mdDialog, crewApi) {
        var dialog = this;
        dialog.tableState = tableState;

        dialog.close = function() {
            // Set the page to the first because if we ask for second page with 10 on a page and there is only
            // 6 results. It will return nothing.

            dialog.tableState.page = 1;
            $mdDialog.hide(dialog.tableState);
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };

        dialog.querySearch = function (field, query) {
            return crewApi.autocomplete(field, query);
        }
    }
})();
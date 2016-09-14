(function() {
    angular.module('simplejobs')
        .controller('crewDialogFilterCtrl', crewDialogFilterCtrl);

    crewDialogFilterCtrl.$inject = ['tableState', '$mdDialog', 'crewApi'];

    function crewDialogFilterCtrl(tableState, $mdDialog, crewApi) {
        var dialog = this;
        dialog.tableState = tableState;

        dialog.close = function() {
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
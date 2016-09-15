(function() {
    angular.module('simplejobs')
        .controller('userDialogFilterCtrl', userDialogFilterCtrl);

    userDialogFilterCtrl.$inject = ['tableState', '$mdDialog', 'userApi'];

    function userDialogFilterCtrl(tableState, $mdDialog, userApi) {
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
            return userApi.autocomplete(field, query);
        };
    }
})();
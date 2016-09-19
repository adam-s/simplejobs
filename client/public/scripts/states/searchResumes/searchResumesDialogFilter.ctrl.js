(function() {
    angular.module('simplejobs')
        .controller('searchResumesDialogFilterCtrl', searchResumesDialogFilterCtrl);

    searchResumesDialogFilterCtrl.$inject = ['$scope', 'tableState', '$mdDialog'];

    function searchResumesDialogFilterCtrl($scope, tableState, $mdDialog) {
        var dialog = this;
        dialog.tableState = tableState;
        // Get location
        if (dialog.tableState.latitude && dialog.tableState.longitude) {
            dialog.location = {
                coordinates: [dialog.tableState.longitude, dialog.tableState.latitude]
            };
        }

        $scope.$watch('dialog.location', function() {
            // Set location
            if (dialog.location) {
                dialog.tableState.latitude = dialog.location.coordinates[1];
                dialog.tableState.longitude = dialog.location.coordinates[0];
            } else {
                delete dialog.tableState.latitude;
                delete dialog.tableState.longitude;
            }
        });

        dialog.close = function() {
            dialog.tableState.page = 1;
            $mdDialog.hide(dialog.tableState);
        };

        dialog.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();
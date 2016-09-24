(function() {
    angular.module('simplejobs')
        .factory('errorHandler', errorHandler);
    
    errorHandler.$inject = ['$mdDialog'];
    
    function errorHandler($mdDialog) {
        return {
            handleValidationErrors: handleValidationErrors
        };

        function handleValidationErrors(response, callback) {
            var alert;

            if (response && response.message === 'Validation error') {
                if (response.errors) {
                    var content = response.errors.reduce(function(string, value) {
                        return string + '<li>' + value.msg + '</li>';
                    }, '');

                    alert = $mdDialog.alert({
                        title: response.message,
                        htmlContent: '<ul>' + content + '</ul>',
                        ok: 'Close',
                        skipHide: true,
                        preserveScope: true,
                        autoWrap: true
                    });
                }
            } else if (response && response.message) {
                alert = $mdDialog.alert({
                    title: response.message,
                    ok: 'Close',
                    skipHide: true,
                    preserveScope: true,
                    autoWrap: true
                })
            } else {
                alert = $mdDialog.alert({
                    title: 'An error occurred. Sorry :(',
                    ok: 'Close',
                    skipHide: true,
                    preserveScope: true,
                    autoWrap: true
                })
            }

            $mdDialog
                .show(alert)
                .finally(function() {
                    alert = undefined;
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
        }
    }
})();
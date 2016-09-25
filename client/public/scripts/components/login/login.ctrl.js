(function() {
    angular.module('simplejobs')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$window', '$location', '$state', '$mdDialog', 'vcRecaptchaService', 'Auth', 'errorHandler'];

    function loginCtrl($window, $location, $state, $mdDialog, vcRecaptchaService, Auth, errorHandler) {
        var vm = this;

        // Private variables
        var widgetId; // Private variable to hold id from callback;

        // Shared variables
        vm.auth = Auth;
        vm.credentials = {};
        vm.disableFlag = false;
        vm.isLogin = true;
        vm.recaptchaSiteKey = $window.values.recaptchaSiteKey;
        vm.size = 200;

        // Shared methods
        vm.register = register;
        vm.login = login;
        vm.setWidgetId = setWidgetId;
        vm.hideDialog = hideDialog;

        if (vm.auth.me) {
            $location.path('/');
        }

        function register() {
            vm.disableFlag = true;
            Auth.register(vm.credentials)
                .then(function success() {
                    vm.disableFlag = false;
                    $location.path('/');
                    $mdDialog.hide();
                }, function reject(response) {
                    // The first recaptcha needs to be refreshed so invalidate it.
                    vcRecaptchaService.reload(widgetId);
                    errorHandler.handleValidationErrors(response);
                    vm.disableFlag = false;
                })
        }

        function login() {
            vm.disableFlag = true;
            Auth.login(vm.credentials)
                .then(function success() {
                    vm.disableFlag = false;
                    $state.go('account', {}, {reload: true});
                    $mdDialog.hide();
                }, function reject(response) {
                    errorHandler.handleValidationErrors(response);
                    vm.disableFlag = false;
                })

        }

        function hideDialog() {
            console.log('is hide being called');
            $mdDialog.hide();
        }

        function setWidgetId(_widgetId) {
            console.log(_widgetId);
            widgetId = _widgetId;
        }

        function handleValidationErrors(response) {
            var duplicate = false; // First find if the email is a duplicate
            var alert;

            if (response.message === 'Validation error') {
                if (response.errors) {
                    response.errors.forEach(function(error) {
                        if (error.msg === 'The email field must be unique') {
                            duplicate = true;
                        }
                    });

                    // If there is a single duplicate error than it needs to be redirected otherwise loop through.
                    if (duplicate === true) {
                        alert = $mdDialog.alert({
                            title: 'Account already exists',
                            htmlContent: 'Please use login or recover password',
                            ok: 'Close'
                        });

                        $mdDialog
                            .show(alert)
                            .finally(function() {
                                $location.path('/auth/login');
                            })
                    } else {
                        var content = response.errors.reduce(function(string, value) {
                            return string + '<li>' + value.msg + '</li>';
                        }, '');

                        alert = $mdDialog.alert({
                            title: response.message,
                            htmlContent: '<ul>' + content + '</ul>',
                            ok: 'Close'
                        });

                        $mdDialog
                            .show(alert)
                            .finally(function() {
                                alert = undefined;
                            });
                    }
                }
            }
        }
    }
})();
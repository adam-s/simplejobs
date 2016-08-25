(function() {
    angular.module('simplejobs')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$location', 'Auth', '$mdDialog'];

    function LoginCtrl($location, Auth, $mdDialog) {
        var vm = this;
        vm.auth = Auth;
        vm.credentials = {};
        vm.register = register;
        vm.login = login;
        vm.disableFlag = false;

        if (vm.auth.me) {
            $location.path('/');
        }

        function register() {
            vm.disableFlag = true;
            Auth.register(vm.credentials)
                .then(function success() {
                    vm.disableFlag = false;
                    $location.path('/');
                }, function reject(response) {
                    handleValdationErrors(response);
                    vm.disableFlag = false;
                })
        }

        function login() {
            vm.disableFlag = true;
            Auth.login(vm.credentials)
                .then(function success() {
                    vm.disableFlag = false;
                    $location.path('/account');
                }, function reject(response) {
                    handleValidationErrors(response);
                    vm.disableFlag = false;
                })

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
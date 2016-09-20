(function() {
    angular.module('simplejobs')
        .controller('test', test);

    test.$inject = ['$window', '$timeout'];

    function test($window, $timeout) {
        var vm = this;

        var facebookPopup;

        // Use window.openen with attached methods for login and error
        vm.callFacebookOauth = function() {
            // Use window.opener.login
            // Render this in auth controller using templates in server/views
            // Invoke with following script
            // <html>
            // <head><script type="text/javascript">document.domain = 'codingame.com'; function onClose() {close();} </script></head>
            // <body><script type="text/javascript">window.opener.loginError('An error has occurred.'); onClose()</script></body>
            // </html>

            // window.opener.login
            $window.login = function(user) {
                // Set the Auth.me to user
                // digest
                // Go home
                console.log(user);
            };

            // window.opener.loginError
            $window.loginError = function(error) {
                // Show error
                // Go back to login
            };

            facebookPopup = $window.open("/auth/facebook", "facebookPopup", "menubar=no, status=no, scrollbars=no, menubar=no, width=600, height=500");
            facebookPopup.focus();
        };
    }
})();

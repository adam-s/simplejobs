(function() {
    angular.module('simplejobs')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$window', 'Auth'];

    function homeCtrl($window, Auth) {
        var vm = this;
        console.log(Auth.me)
    }
})();
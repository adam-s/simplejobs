(function() {
    angular.module('simplejobs')
        .controller('sjCollapseSectionCtrl', sjCollapseSectionCtrl);

    sjCollapseSectionCtrl.$inject = [];

    function sjCollapseSectionCtrl() {
        var ctrl = this;

        ctrl.collapsed = true;
    }
})();
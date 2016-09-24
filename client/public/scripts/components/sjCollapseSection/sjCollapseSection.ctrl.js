(function() {
    angular.module('simplejobs')
        .controller('sjCollapseSectionCtrl', sjCollapseSectionCtrl);

    sjCollapseSectionCtrl.$inject = [];

    function sjCollapseSectionCtrl() {
        var ctrl = this;

        ctrl.collapsed = true;

        ctrl.toggle = function($event) {
            $event.stopImmediatePropagation();
            ctrl.collapsed = !ctrl.collapsed;
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .controller('sjPaginationCtrl', sjPaginationCtrl);

    sjPaginationCtrl.$inject = ['$mdUtil'];

    function sjPaginationCtrl($mdUtil) {
        var vm = this;

        vm.totalPages = vm.limit > 0 ? Math.ceil(vm.count / vm.limit) : 1;

        vm.onPaginationChange = function() {
            if (angular.isFunction(vm.onPagination)) {
              $mdUtil.nextTick(function() {
                  vm.onPagination(vm.page, vm.limit);
              });
            }
        };

        vm.nextPage = function() {
            vm.page++;
            vm.onPaginationChange();
        };

        vm.previousPage = function() {
            vm.page--;
            vm.onPaginationChange();
        };

        vm.firstPage = function() {
            vm.page = 1;
            vm.onPaginationChange();
        };
    }
})();
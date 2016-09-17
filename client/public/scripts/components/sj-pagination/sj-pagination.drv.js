(function() {
    angular.module('simplejobs')
        .directive('sjPagination', sjPagination);

    sjPagination.$inject = [];

    function sjPagination() {
        return {
            restrict: 'EA',
            controller: 'sjPaginationCtrl as vm',
            templateUrl: 'scripts/components/sj-pagination/sj-pagination.tpl.html',
            scope: {
                page: '=', // current page
                limit: '=', // Number of items on a page
                count: '=', // Total number of items
                onPagination: '=' // Function to call on action
            },
            bindToController: true
        }
    }
})();
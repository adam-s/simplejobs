(function() {
    angular.module('simplejobs')
        .filter('orderBySelectedOption', orderBySelectedOption);

    orderBySelectedOption.$inject = [];

    function orderBySelectedOption() {
        return function(input, current) {
            var list = [];
            angular.forEach(input, function(item) {
                var compare = (item.name) ? item.name : item;
                compare == current ? list.unshift(item) : list.push(item)
            });
            return list
        }
    }
})();
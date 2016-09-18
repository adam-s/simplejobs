(function() {
    angular.module('simplejobs')
        .factory('sjDistance', sjDistance);

    sjDistance.$inject = [];

    function sjDistance() {
        // http://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error/7179026#7179026

        var RADIUS_KM = 6371; // Radius of the earth in km
        var RADIUS_MI = 3959; // Radius of the earth in mi
        var R;

        return function(unit) {

            R = unit === 'mi' ? RADIUS_MI : RADIUS_KM;

            return function(lat1, lon1, lat2, lon2) {
                var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
                var dLon = (lon2 - lon1) * Math.PI / 180;
                var a =
                    0.5 - Math.cos(dLat)/2 +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    (1 - Math.cos(dLon))/2;

                return R * 2 * Math.asin(Math.sqrt(a));
            }
        };
    }
})();
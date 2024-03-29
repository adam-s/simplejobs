(function() {
    angular.module('simplejobs')
        .controller('locationSearchCtrl', locationSearchCtrl);

    locationSearchCtrl.$inject = ['$scope', '$q'];

    /**
     * @ngdoc directive
     * @name locationApp.directive:placeAutocomplete
     * @author Vinay Gopinath
     * @description
     *
     * # An element directive that provides a dropdown of
     * location suggestions based on the search string.
     * When an item is selected, the location's latitude
     * and longitude are determined.
     *
     * This directive depends on the Google Maps API
     * with the places library, i.e,
     * <script src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
     *
     * @example
     * <place-autocomplete ng-model="selectedLocation"></place-autocomplete>
     *
     * Demo:
     * http://plnkr.co/edit/dITwTF?p=preview
     *
     * Credit:
     * http://stackoverflow.com/a/31510437/293847
     */
    function locationSearchCtrl($scope, $q) {
        if (typeof google === 'undefined' || !google.maps) {
            throw new Error('Google Maps JS library is not loaded!');
        } else if (!google.maps.places) {
            throw new Error('Google Maps JS library does not have the Places module');
        }
        var autocompleteService = new google.maps.places.AutocompleteService();
        var map = new google.maps.Map(document.createElement('div'));
        var placeService = new google.maps.places.PlacesService(map);
        $scope.label = $scope.label || 'Location (area and city)';


        /**
         * @ngdoc function
         * @name getResults
         * @description
         *
         * Helper function that accepts an input string
         * and fetches the relevant location suggestions
         *
         * This wraps the Google Places Autocomplete Api
         * in a promise.
         *
         * Refer: https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service
         */
        var getResults = function(address) {
            var deferred = $q.defer();
            autocompleteService.getQueryPredictions({
                input: address
            }, function(data) {
                if (data) {
                    deferred.resolve(data);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name getDetails
         * @description
         * Helper function that accepts a place and fetches
         * more information about the place. This is necessary
         * to determine the latitude and longitude of the place.
         *
         * This wraps the Google Places Details Api in a promise.
         *
         * Refer: https://developers.google.com/maps/documentation/javascript/places#place_details_requests
         */
        var getDetails = function(place) {
            var deferred = $q.defer();
            placeService.getDetails({
                'placeId': place.place_id
            }, function(details) {
                deferred.resolve(details);
            });
            return deferred.promise;
        };

        $scope.search = function(input) {
            if (!input) {
                return;
            }
            return getResults(input).then(function(places) {
                return places;
            });
        };

        var extractFromAddress = function extractFromAddress(components, type){
            for (var i=0; i<components.length; i++)
                for (var j=0; j<components[i].types.length; j++)
                    if (components[i].types[j]==type) return components[i].long_name;
            return "";
        };

        /**
         * @ngdoc function
         * @name getLatLng
         * @description
         * Updates the scope ngModel variable with details of the selected place.
         * The latitude, longitude and name of the place are made available.
         *
         * This function is called every time a location is selected from among
         * the suggestions.
         */
        $scope.getLatLng = function(item) {
            if (!item) {
                $scope.place = {};
                return;
            }
            getDetails(item).then(function(details) {
                $scope.place = {
                    name: item.description,
                    locality: extractFromAddress(details.address_components, 'locality'),
                    district: extractFromAddress(details.address_components, 'administrative_area_level_2'),
                    administrativeArea: extractFromAddress(details.address_components, 'administrative_area_level_1'),
                    country: extractFromAddress(details.address_components, 'country'),
                    coordinates: [details.geometry.location.lng(), details.geometry.location.lat()]
                };
            });
        }
    }
})();
(function() {
    angular.module('simplejobs')
        .directive('locationSearchExtend', locationSearchExtend);

    locationSearchExtend.$inject = ['$q'];
    function locationSearchExtend($q) {

        if (typeof google === 'undefined' || !google.maps) {
            throw new Error('Google Maps JS library is not loaded!');
        } else if (!google.maps.places) {
            throw new Error('Google Maps JS library does not have the Places module');
        }
        var autocompleteService = new google.maps.places.AutocompleteService();
        var map = new google.maps.Map(document.createElement('div'));
        var placeService = new google.maps.places.PlacesService(map);

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

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

                var getDetails = function(place) {
                    var deferred = $q.defer();
                    placeService.getDetails({
                        'placeId': place.place_id
                    }, function(details) {
                        deferred.resolve(details);
                    });
                    return deferred.promise;
                };


                var extractFromAddress = function (components, type){
                    for (var i=0; i<components.length; i++)
                        for (var j=0; j<components[i].types.length; j++)
                            if (components[i].types[j]==type) return components[i].long_name;
                    return "";
                };


                scope.search = function(input) {
                    if (!input) {
                        return;
                    }
                    return getResults(input).then(function(places) {
                        return places;
                    });
                };

                scope.getLatLng = function(item) {
                    if (!item) {
                        return;
                    }
                    getDetails(item).then(function(details) {
                        ctrl.$setViewValue({
                            name: item.description,
                            locality: extractFromAddress(details.address_components, 'locality'),
                            district: extractFromAddress(details.address_components, 'administrative_area_level_2'),
                            administrativeArea: extractFromAddress(details.address_components, 'administrative_area_level_1'),
                            country: extractFromAddress(details.address_components, 'country'),
                            coordinates: [details.geometry.location.lng(), details.geometry.location.lat()]
                        });
                    });
                };

                ctrl.$formatters.push(function(modelValue) {
                    scope.searchText = '';
                    return modelValue;
                });

                ctrl.$parsers.push(function(viewModel) {
                    console.log('parser', viewModel);
                    console.log(scope);
                    return viewModel;
                })
            }
        }
    }
})();
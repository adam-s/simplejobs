(function() {
    angular.module('simplejobs')
        .factory('crewApi', crewApi);

    crewApi.$inject = ['RestApi'];

    var endpoint = '/api/crew-listings/';

    function crewApi(RestApi) {
        console.log('crewApi');
        return RestApi(endpoint);
    }
})();
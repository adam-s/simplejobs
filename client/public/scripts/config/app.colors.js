(function() {
    angular.module('simplejobs').config(colors);

    colors.$inject = ['$mdThemingProvider'];

    function colors ($mdThemingProvider) {
        var customPrimary = {
            '50': '#a8bac3',
            '100': '#99aeb8',
            '200': '#8aa2ae',
            '300': '#7a96a3',
            '400': '#6b8a99',
            '500': '#607D8B',
            '600': '#566f7c',
            '700': '#4b626d',
            '800': '#41545e',
            '900': '#36474f',
            'A100': '#b7c6cd',
            'A200': '#c6d2d8',
            'A400': '#d5dee2',
            'A700': '#2c3940'
        };
        $mdThemingProvider
            .definePalette('customPrimary',
            customPrimary);

        var customAccent = {
            '50': '#0040aa',
            '100': '#0049c3',
            '200': '#0053dd',
            '300': '#005cf6',
            '400': '#116aff',
            '500': '#2a7aff',
            '600': '#5d9aff',
            '700': '#77aaff',
            '800': '#90baff',
            '900': '#aacaff',
            'A100': '#5d9aff',
            'A200': '#448AFF',
            'A400': '#2a7aff',
            'A700': '#c3daff'
        };
        $mdThemingProvider
            .definePalette('customAccent',
            customAccent);

        var customWarn = {
            '50': '#fbb4af',
            '100': '#f99d97',
            '200': '#f8877f',
            '300': '#f77066',
            '400': '#f55a4e',
            '500': '#F44336',
            '600': '#f32c1e',
            '700': '#ea1c0d',
            '800': '#d2190b',
            '900': '#ba160a',
            'A100': '#fccbc7',
            'A200': '#fde1df',
            'A400': '#fff8f7',
            'A700': '#a21309'
        };
        $mdThemingProvider
            .definePalette('customWarn',
            customWarn);

        $mdThemingProvider.theme('default')
            .primaryPalette('customPrimary')
            .accentPalette('customAccent')
            .warnPalette('customWarn')
    }
})();
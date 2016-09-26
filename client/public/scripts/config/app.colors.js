(function() {
    angular.module('simplejobs').config(colors);

    colors.$inject = ['$mdThemingProvider'];

    function colors ($mdThemingProvider) {

        var greenCustomPrimary = {
            '50': '#79cb7d',
            '100': '#66c46b',
            '200': '#54bc59',
            '300': '#45b24a',
            '400': '#3e9f43',
            '500': 'rgb(55, 141, 59)',
            '600': '#307b33',
            '700': '#29682c',
            '800': '#225624',
            '900': '#1a441c',
            'A100': '#8bd28e',
            'A200': '#9ed9a0',
            'A400': '#b0e0b2',
            'A700': '#133115',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 300 400 A100',
            'contrastStrongLightColors': '500 600 700 A200 A400 A700'
        };

        $mdThemingProvider
            .definePalette('greenCustomPrimary',
            greenCustomPrimary);

        $mdThemingProvider
            .theme('green')
            .primaryPalette('greenCustomPrimary')
            .accentPalette('orange')
            .warnPalette('red')
            .backgroundPalette('grey');

        var blueCustomPrimary = {
            '50': '#40eaff',
            '100': '#27e7ff',
            '200': '#0de5ff',
            '300': '#00d8f3',
            '400': '#00c2d9',
            '500': 'rgb(0, 171, 192)',
            '600': '#0094a6',
            '700': '#007e8d',
            '800': '#006773',
            '900': '#00505a',
            'A100': '#5aedff',
            'A200': '#73f0ff',
            'A400': '#8df3ff',
            'A700': '#003940',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 A100',
            'contrastStrongLightColors': '300 400 500 600 700 A200 A400 A700'
        };

        $mdThemingProvider
            .definePalette('blueCustomPrimary', blueCustomPrimary);

        $mdThemingProvider
            .theme('default')
            .primaryPalette('blueCustomPrimary')
            .accentPalette('orange')
            .warnPalette('red')
            .backgroundPalette('grey');
    }
})();
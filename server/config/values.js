'use strict';

var positions = ['Chef', 'Captain', 'Engineer', 'Steward', 'Deckhand', 'Dayworker', 'Other'];
var languages = ['English', 'Spanish', 'French', 'Italian', 'German', 'Mandarin', 'Hindi', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Arabic', 'Other'];
var jobTypes = ['Motor', 'Sailing', 'Sportfish', 'Commercial', 'Marina', 'Office', 'Other'];
var popularPorts = [
    {
        name: 'Fort Lauderdale',
        location: {
            locality: 'Fort Lauderdale',
            district: 'Broward County',
            administrativeArea: 'Florida',
            country: 'United States',
            coordinates: [-80.1373170, 26.1224390]
        }
    },
    {
        name: 'Newport',
        location: {
            locality: 'Newport',
            district: 'Newport County',
            administrativeArea: 'Rhode Island',
            country: 'United States',
            coordinates: [-71.3128290, 41.4901020]
        }
    },
    {
        name: 'Palma de Mallorca',
        location: {
            locality: 'Palma',
            district: 'Balearic Islands',
            administrativeArea: 'Balearic Islands',
            country: 'United States',
            coordinates: [2.6501600, 39.5696000]
        }
    }
];

module.exports = {
    positions: positions,
    languages: languages,
    vesselTypes: jobTypes,
    popularPorts: popularPorts
};
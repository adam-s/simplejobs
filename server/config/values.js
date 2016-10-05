'use strict';

var config = require('./config.js');

var positions = ['Chef', 'Captain', 'Engineer', 'Steward', 'Deckhand', 'Daywork', 'Technician',
    'Mechanic', 'Electrician', 'Carpenter', 'Administration', 'Broker', 'Sales', 'Other'];
var languages = ['English', 'Spanish', 'French', 'Italian', 'German', 'Mandarin', 'Hindi', 'Portuguese',
    'Russian', 'Japanese', 'Korean', 'Arabic', 'Other'];
var jobTypes = ['Yacht', 'Commercial', 'Marina', 'Office', 'Technician', 'Other'];
var vesselTypes = ['Motor', 'Sail', 'Sportfish', 'Commercial', 'Other'];
var popularPorts = [
    {
        name: 'Fort Lauderdale',
        locality: 'Fort Lauderdale',
        district: 'Broward County',
        administrativeArea: 'Florida',
        country: 'United States',
        coordinates: [-80.1373170, 26.1224390]
    },
    {
        name: 'Annapolis',
        locality: 'Annapolis',
        district: 'Anne Arundel County',
        administrativeArea: 'Maryland',
        country: 'United States',
        coordinates: [-76.4921828, 38.9784452]
    },
    {
        name: 'Antibes',
        locality: 'Antibes',
        district: 'Alpes-Maritimes',
        administrativeArea: 'Provence-Alpes-Côte d\'Azur',
        country: 'France',
        coordinates: [7.1251019, 43.5804179]
    },
    {
        name: 'Nantucket',
        locality: 'Nantucket',
        district: 'Nantucket County',
        administrativeArea: 'Massachusetts',
        country: 'United States',
        coordinates: [-70.0994509, 41.2834704]
    },
    {
        name: 'Newport',
        locality: 'Newport',
        district: 'Newport County',
        administrativeArea: 'Rhode Island',
        country: 'United States',
        coordinates: [-71.3128290, 41.4901020]
    },
    {
        name: 'Palma de Mallorca',
        locality: 'Palma',
        district: 'Balearic Islands',
        administrativeArea: 'Balearic Islands',
        country: 'Spain',
        coordinates: [2.6501600, 39.5696000]
    },
    {
        name: 'Sint Maarten',
        locality: '',
        district: '',
        administrativeArea: 'Sint Maarten',
        country: 'Sint Marrten',
        coordinates: [-63.1163275, 18.0385649]
    },
    {
        name: 'St. Thomas',
        locality: 'LOCALITY',
        district: 'DISTRICT',
        administrativeArea: 'St. Thomas',
        country: 'U.S. Virgin Islands',
        coordinates: [-64.9534009, 18.335361]
    }
];

module.exports = {
    positions: positions,
    languages: languages,
    jobTypes: jobTypes,
    popularPorts: popularPorts,
    vesselTypes: vesselTypes,
    recaptchaSiteKey: config.recaptcha.siteKey,
    googleAnalyticsId: config.googleAnalytics.trackingId,
    facebookPixelId: config.facebook.pixelId
};
'use strict';

var crew = require('../controllers/crew.listings.controller.js');

module.exports = function(app) {

    app.route('/api/crew-listings')
        .get(crew.index)
        .post(crew.create);

    app.route('/api/crew-listings/:crewListingId')
        .get(crew.detail)
        .put(crew.update)
        .delete(crew.remove);

    app.param('crewListingId', crew.crewListingById);
};
'use strict';

var user = require('../controllers/users.controller.js');

module.exports = function(app) {

    app.route('/api/users')
        .get(user.index)
        .post(user.create);

    app.route('/api/users/:userId')
        .get(user.detail)
        .put(user.update)
        .delete(user.remove);

    app.param('userId', user.userById);
};
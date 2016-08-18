'use strict';

var config = require('./config');

module.exports = function(app, db) {
    return new Promise(function(resolve) {
        var User = db.model('User');
        User.findOne({ email: config.adminAccountEmail}, function(err, user) {
            if (err) throw err;
            if (!user) {
                var newAdmin = new User({
                    email: config.adminAccountEmail,
                    password: config.adminAccountPassword,
                    roles: ['administrator', 'authenticated', 'anonymous']
                });
                newAdmin.save(function(err) {
                    if (err) throw err;
                    resolve();
                })
            } else {
                resolve();
            }
        })
    })
};
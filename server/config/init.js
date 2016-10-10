'use strict';

var config = require('./config');

module.exports = function(app, db) {
    return new Promise(function(resolve) {
        var User = db.model('User');
        User.findWithDeleted({ email: config.admin.accountEmail}, function(err, users) {
            var user = users[0];
            if (err) throw err;
            if (!user) {
                var newAdmin = new User({
                    email: config.admin.accountEmail,
                    password: config.admin.accountPassword,
                    roles: ['administrator', 'authenticated', 'anonymous']
                });
                newAdmin.save(function(err) {
                    if (err) throw err;
                    return resolve();
                })
            } else if (user.deleted) {
                // Weird I was just messing around and deleted it. Mayhem ensued.
                user.restore(function() {
                    return resolve();
                })
            } else {
                return resolve();
            }
        })
    })
};
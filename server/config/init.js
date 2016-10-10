'use strict';

var config = require('./config');

module.exports = function(app, db) {
    return new Promise(function(resolve) {
        // TODO I really need to find a much better way to insure that there is an immutable admin user.
        // The only thing that should be able to change here is the password.

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
            } else if (!user.isAdmin()) {
                //OMG this is so stupid there must be a better way
                User.update(
                    { _id: user._id },
                    { $push: { roles: {$each: ['administrator', 'authenticated', 'anonymous'] }}},
                    { upsert: true},
                    function() {
                        return resolve();
                    })
            } else {
                return resolve();
            }
        })
    })
};
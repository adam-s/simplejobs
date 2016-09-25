'use strict';
// So what? Your IP address has ::ffff: prefix? No worries it is a conversion of IPv4 to IPv6
// internally everything knows what is going on.
// http://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
module.exports = function getClientIp() {

    return function (req, res, next) {
        var ipAddress;
        // Amazon EC2 / Heroku workaround to get real client IP
        var forwardedIpsStr = req.header('x-forwarded-for');
        if (forwardedIpsStr) {
            // 'x-forwarded-for' header may return multiple IP addresses in
            // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
            // the first one
            var forwardedIps = forwardedIpsStr.split(',');
            ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
            // Ensure getting client IP address still works in
            // development environment
            ipAddress = req.connection.remoteAddress;
        }

        req.app.locals.ipAddress = ipAddress;

        return next();
    }
};
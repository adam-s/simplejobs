'use strict';

var config = require('./config'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    customValidators = require('./customValidators.js'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// Define the Express configuration method
module.exports = function (db) {
    // Create a new Express application instance
    var app = express();

    // Create a new HTTP server
    var server = http.createServer(app);

    // Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        //app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // Set the application view engine and 'views' folder
    app.engine('html', consolidate['swig']);
    app.set('view engine', 'html');
    app.set('views', './server/views');

    // Configure static file serving
    // @link http://evanhahn.com/express-dot-static-deep-dive/
    app.use(express.static('./' + config.dir + '/public', {
        index: false
    }));

    // Configure and initialize session
    app.use(cookieParser());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            // session expiration is set by default to 24 hours
            maxAge: 24 * (60 * 60 * 1000),
            // httpOnly flag makes sure the cookie is only accessed
            // through the HTTP protocol and not JS/browser
            httpOnly: true,
            // secure cookie should be turned to true to provide additional
            // layer of security so that the cookie is set only when working
            // in HTTPS mode.
            secure: false
        },
        sessionKey: 'sessionId',
        store: new MongoStore({
            mongooseConnection: db.connection,
            collection: 'sessions'
        })
    }));

    // Use express validator to assert errors
    // @link https://github.com/ctavan/express-validator
    app.use(expressValidator());
    app.use(customValidators());

    // Load and initialize passport
    // Initializing the session has to come after the statics
    // @link https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
    require('./passport.js')(app);

    // Load the routing files
    require('../routes/download.routes')(app);
    require('../routes/auth.routes.js')(app);
    require('../routes/crew.listings.routes.js')(app);
    require('../routes/job.listings.routes.js')(app);
    require('../routes/mocks.routes.js')(app);
    require('../routes/users.routes.js')(app);

    // This has to go last as a catch all
    require('../routes/app.routes.js')(app);

    // Return the Server instance
    return server;
};
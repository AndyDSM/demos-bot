const app = require('express')();

const bodyParser = require('body-parser');
const db = require('./db/DB.js');
const config = require('./util/config.js');
const C = require('./util/console.js');

const express_session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(express_session);
const store = new MongoDBStore({ uri: config.db, collection: 'sessions' });
const session = express_session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {}
});

const WS = require('./ws/WS.js'); // websocket server
const API = require('./api/API.js'); // api router

const uuid = require('./util/id.js'); // id generator

const Renderer = require('./pages/render.js'); // get pug templates
const fs = require('fs');

db.p.then(() => {
    const server = require('http').Server(app);

    app.use(bodyParser.json());

    app.use(session);

    app.use(function(req, res, next) {
        C.logDev(req.path);
        req.session.ip = req.connection.remoteAddress;
        req.session.id = req.sessionID;
        if (req.session.wsIDs === undefined) req.session.wsIDs = [];
        req.WS = WS;
        next();
    });

    WS.start(server, session);

    app.get('/', function(req, res) {
        res.send(Renderer.render('main', { youAreUsingPug: true, externaljs: ['https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js'], localjs: ['main'] }));
    });

    app.use('/js/', function(req, res) {
        //C.logTest(req.path);
        let r = '404';
        try {
            r = fs.readFileSync('src/pages/js' + req.path);
        } catch (e) {}
        res.send(r);
    });

    app.get('/favicon.ico', function(req, res) {
        let r = '404';
        try {
            r = fs.readFileSync('src/img/favicon.jpg');
            res.set('Content-Type', 'image/jpeg');
        } catch (e) {}
        res.send(r);
    });

    app.use('/api/', API);

    server.listen(6568);

}).catch(C.logError);

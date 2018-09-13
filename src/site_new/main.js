const app = require('express')();
const server = require('http').Server(app);

const bodyParser = require('body-parser');
const config = require('demos-config');
const C = require('demos-console');

const express_session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(express_session);
const store = new MongoDBStore({ uri: config.db, collection: 'sessions' });
const session = express_session({
    secret: config.site.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {}
});

const fs = require('fs');


app.use(bodyParser.json());

app.use(session);

app.use(function(req, res, next) {
    C.logDev('Connection:',req.path);
    next();
});

//WS.start(server, session);

/*app.get('/', function(req, res) {
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

app.use('/api/', API);*/

server.listen(6568);


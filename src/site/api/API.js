const API = require('express').Router();
const C = require('../util/console.js');

API.get('/', function(req, res) {
    C.logTest(__dirname, require.main.filename);
    res.send('hey cunt');
});

API.get('/add/', function(req, res) {
    C.logTest(req.query);
    let Test = require('../db/models/Test.js');
    let testMeme = new Test({ name: req.query.name + '' });
    testMeme.save(function(err) {
        if (err) console.error(err);
    })
    res.send('hey cunto');
});

API.get('/register/', function(req, res) {
    C.logTest(req.query);
    require('../db/actions/UserRegister.js')(req, res).then(function(m) {
        C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

API.get('/login/', function(req, res) {
    C.logTest(req.query);
    require('../db/actions/UserLogin.js')(req, res).then(function(m) {
        C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

API.get('/logout/', function(req, res) {
    C.logTest(req.query);
    require('../db/actions/UserLogout.js')(req, res).then(function(m) {
        C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

API.get('/c/create', function(req, res) {
    C.logTest(req.query);
    require('../db/actions/CommunityCreate.js')(req, res).then(function(m) {
        C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

API.get('/c/add-chat', function(req, res) {
    C.logTest(req.query);
    require('../db/actions/CommunityAddChat.js')(req, res).then(function(m) {
        C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

API.get('/get-sockets/', function(req, res) {
    //C.logTest(req.query);
    require('../db/actions/SocketsReturnAll.js')(req, res).then(function(m) {
        //C.logTest(m);
        res.json(m);
    }).catch((err) => {
        C.logError(err);
    });
});

module.exports = API;

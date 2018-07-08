const mongoose = require('mongoose');
const config = require('../util/config.json');
const C = require('../util/console.js');

mongoose.connect(config.db, { autoIndex: false });
let db = mongoose.connection;

exports.m = mongoose;
exports.p = new Promise(function(res, rej) {
    db.on('error', function() {
        C.logError('MongoDB connection error')
        rej();
    });
    db.once('open', function() {
        C.log('MongoDB connected');
        res();
    });
});

const mongoose = require('../mongoose.js');
const C = require('demos-console');

module.exports = function (dbURL) {
    //console.log('discStr:', mongoose);
    mongoose.connect(dbURL, {autoIndex: false});
    let db = mongoose.connection;
    return new Promise(function(res, rej) {
        db.on('error', function() {
            C.logError('MongoDB connection error');
            rej();
        });
        db.once('open', function() {
            C.log('MongoDB connected');
            res();
        });
    });
}

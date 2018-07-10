const Vote = require('../models/Vote.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id, u, o) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Vote.updateOne({ id: id, u: u }, { $set: { o: o } }, function(err) {
            if (err) rej(util.error.dbError);
            else res(o);
        });
    });
}

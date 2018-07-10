const Poll = require('../models/Poll.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id, vc) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Poll.updateOne({ id: id }, { $set: { vc: vc } }, function(err) {
            if (err) rej(util.error.dbError);
            else res();
        });
    });
}

const Poll = require('../_models/Poll.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id, vc) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Poll.updateOne({ id: id }, { $set: { vc: vc } }, function(err) {
            if (err) rej(util.error.dbError);
            else res();
        });
    });
}

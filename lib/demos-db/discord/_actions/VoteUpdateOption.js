const Vote = require('../_models/Vote.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id, u, o) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Vote.updateOne({ id: id, u: u }, { $set: { o: o } }, function(err) {
            if (err) rej(util.error.dbError);
            else res(o);
        });
    });
}

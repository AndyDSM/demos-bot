const Vote = require('../_models/Vote.js').model;
const util = require('../../util/util.js');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        Vote.deleteMany({ id: id }, (err) => {
            if (err) rej(util.error.dbError);
            else res();
        });
    });
}

const Poll = require('../models/Poll.js').model;
const util = require('../../util/util.js');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        Poll.deleteOne({ id: id }, (err) => {
            if (err) rej(util.error.dbError);
            else res();
        });
    });
}

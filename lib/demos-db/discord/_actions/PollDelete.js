const Poll = require('../_models/Poll.js').model;
const util = require('demos-util');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        Poll.deleteOne({ id: id }, (err) => {
            if (err) rej(util.error.dbError);
            else res();
        });
    });
}

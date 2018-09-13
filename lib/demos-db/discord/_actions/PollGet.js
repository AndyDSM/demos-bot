const Poll = require('../_models/Poll.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        Poll.findOne({ id: id }, function(err, poll) {
            if (err) rej(util.error.dbError);
            else if (poll === null) rej(util.error.pollNotFound);
            else res(poll);
        });
    });
}

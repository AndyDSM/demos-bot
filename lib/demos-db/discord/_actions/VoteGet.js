const Vote = require('../_models/Vote.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id, u) {
    return new Promise(function(res, rej) {
        Vote.findOne({ id: id, u: u }, function(err, vote) {
            if (err) rej(util.error.dbError);
            else if (vote === null) rej(util.error.voteNotFound);
            else res(vote);
        });
    });
}

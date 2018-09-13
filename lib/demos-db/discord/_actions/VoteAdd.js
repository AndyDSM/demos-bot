const Vote = require('../_models/Vote.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id, u, o) {
    return new Promise(function(res, rej) {

        let voteProps = Object.assign({ id: id, u: u, o: o });

        let voteItem = new Vote(voteProps);
        voteItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(voteProps);
        });
    });
}

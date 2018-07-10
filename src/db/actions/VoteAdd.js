const Vote = require('../models/Vote.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

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

const Vote = require('../models/Vote.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id, u) {
    return new Promise(function(res, rej) {
        Vote.findOne({ id: id, u: u }, function(err, vote) {
            if (err) rej(util.error.dbError);
            else if (vote === null) rej(util.error.voteNotFound);
            else res(vote);
        });
    });
}

const Poll = require('../models/Poll.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        Poll.findOne({ id: id }, function(err, poll) {
            if (err) rej(util.error.dbError);
            else if (poll === null) rej(util.error.pollNotFound);
            else res(poll);
        });
    });
}

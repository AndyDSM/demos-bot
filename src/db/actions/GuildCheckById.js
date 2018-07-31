const Guild = require('../models/Guild.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(guildID) {
    return new Promise(function(res, rej) {
        Guild.findOne({ id: guildID }, 'id', function(err, g) {
            if (err) rej(util.error.dbError);
            else if (g === null) res(false);
            else res(true);
        });
    });
}

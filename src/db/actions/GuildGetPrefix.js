const Guild = require('../models/Guild.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(guild) {
    return new Promise(function(res, rej) {
        Guild.findOne({ id: guild.id }, 'pr', function(err, guild) {
            if (err) rej(util.error.dbError);
            else if (guild === null) rej(util.error.guildNotFound);
            else res(guild.pr);
        });
    });
}

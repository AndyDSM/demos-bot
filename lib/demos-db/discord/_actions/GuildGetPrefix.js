const Guild = require('../_models/Guild.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(guildID) {
    return new Promise(function(res, rej) {
        Guild.findOne({ id: guildID }, 'pr', function(err, guild) {
            if (err) rej(util.error.dbError);
            else if (guild === null) rej(util.error.guildNotFound);
            else res(guild.pr);
        });
    });
}

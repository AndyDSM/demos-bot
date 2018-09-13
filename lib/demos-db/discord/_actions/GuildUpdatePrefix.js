const Guild = require('../_models/Guild.js').model;
const C = require('demos-console');
const config = require('demos-config');
const util = require('demos-util');

module.exports = function(guildID, prefix) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Guild.updateOne({ id: guildID }, { $set: { pr: prefix || config.discord.prefixDefault } }, function(err, guild) {
            if (err) rej(util.error.dbError);
            //else if (guild === null) rej(util.error.guildNotFound);
            else res(prefix);
        });
    });
}

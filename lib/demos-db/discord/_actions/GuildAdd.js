const Guild = require('../_models/Guild.js').model;
const C = require('demos-console');
const config = require('demos-config');
const util = require('demos-util');

module.exports = function(guildID, prefix) {
    return new Promise(function(res, rej) {

        let guildProps = Object.assign({ id: guildID, pr: prefix || config.discord.prefixDefault });

        let guildItem = new Guild(guildProps);
        guildItem.save(function(err) {
            if (err) {
                rej(util.error.dbError);
                return;
            } else {
                res(guildProps);
            }
        });
    });
}

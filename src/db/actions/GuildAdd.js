const Guild = require('../models/Guild.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(guild, prefix) {
    return new Promise(function(res, rej) {

        let guildProps = Object.assign({ id: guild.id, pr: prefix || config.prefixDefault });

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

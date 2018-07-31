const util = require('../util/util.js');

const GuildGetPrefix = require('../db/actions/GuildGetPrefix.js');
const GuildAdd = require('../db/actions/GuildAdd.js');
const GuildUpdatePrefix = require('../db/actions/GuildUpdatePrefix.js');

class Prefix {

    static get(guild) {
        return new Promise((res, rej) => {
            let prefix_ = Prefix.list.get(guild.id);
            if (prefix_ !== undefined) {
                res(prefix_);
                //C.logTest('found prefix through memory');
            } else GuildGetPrefix(guild.id).then((pr) => {
                Prefix.list.set(guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    GuildAdd(guild.id).then(guild => {
                        Prefix.list.set(guild.id, guild.pr);
                        res(guild.pr);
                        return;
                    }).catch(err => {
                        rej(err);
                    });
                } else {
                    rej(err);
                }
            });
        });
    }

    static set(guild, prefix_) {
        return new Promise((res, rej) => {

            Prefix.list.set(guild.id, prefix_);
            GuildUpdatePrefix(guild.id, prefix_).then((pr) => {
                Prefix.list.set(guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    GuildAdd(guild.id, prefix_).then(guild => {
                        Prefix.list.set(guild.id, pr);
                        res(guild.pr);
                        return;
                    }).catch(err => {
                        rej(err);
                    });
                } else {
                    rej(err);
                }
            });
        });
    }

}

Prefix.list = new Map();

module.exports = Prefix;

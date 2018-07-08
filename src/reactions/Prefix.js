const util = require('../util/util.js');

class Prefix {

    static get(guild) {
        return new Promise((res, rej) => {
            let prefix_ = Prefix.list.get(guild.id);
            if (prefix_ !== undefined) {
                res(prefix_);
                //C.logTest('found prefix through memory');
            } else require('../db/actions/GuildGetPrefix.js')(guild).then((pr) => {
                Prefix.list.set(guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    require('../db/actions/GuildAdd.js')(guild).then(guild => {
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
            require('../db/actions/GuildUpdatePrefix.js')(guild, prefix_).then((pr) => {
                Prefix.list.set(guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    require('../db/actions/GuildAdd.js')(guild, prefix_).then(guild => {
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

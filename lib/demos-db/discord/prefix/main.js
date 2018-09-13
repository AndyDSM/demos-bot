const util = require('demos-util');

const GuildGetPrefix = require('../_actions/GuildGetPrefix.js');
const GuildAdd = require('../_actions/GuildAdd.js');
const GuildUpdatePrefix = require('../_actions/GuildUpdatePrefix.js');
const Guild = require('../guild');

class Prefix {

    static async get(g) {
        /*let pr = Prefix.list.get(guild.id);
        if (pr !== undefined) return pr;
        else {
            try {
                pr = await GuildGetPrefix(guild.id);
                Prefix.list.set(guild.id, pr);
                return pr;
            } catch (err) {
                if (err === util.error.guildNotFound) {
                    let guild = await GuildAdd(guild.id)
                    Prefix.list.set(guild.id, guild.pr);
                    return guild.pr;
                } else throw err;
            }
        }*/
        let pr = Prefix.list.get(g.id);
        if (pr !== undefined) return pr;
        else {
            pr = await Guild.getPrefix(g);
            Prefix.list.set(g.id, pr);
            return pr;
        }
    }

    static async set(g, pr) {
        /*Prefix.list.set(guild.id, prefix_);
        try { 
            let pr = await GuildUpdatePrefix(guild.id, prefix_)
            Prefix.list.set(guild.id, pr);
        } catch (err) {
            if (err === util.error.guildNotFound) {
                let guild = await GuildAdd(guild.id, prefix_)
                Prefix.list.set(guild.id, prefix_);
            } else throw err;
        }*/
        Prefix.list.set(g.id, pr);
        await Guild.setPrefix(g, pr);
    }

}

Prefix.list = new Map();

module.exports = Prefix;

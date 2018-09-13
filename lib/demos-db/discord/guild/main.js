const GuildModel = require('../_models/Guild.js').model;
const config = require('demos-config');
const util = require('demos-util');

class Guild {
    static async create(guild) {
        if (await Guild.inDB(guild)) await Guild.add(guild.id);
    }
    static async add(guild, o) {
        try {
            let props = Object.assign({
                id: guild.id,
                pr: config.discord.prefixDefault
            }, o);
            let item = new GuildModel(props);
            await item.save();
            return props;
        } catch (e) { throw util.error.dbError; }
    }

    static async inDB(guild) {
        try {
            let g = await GuildModel.findOne({id: guild.id}, 'id').exec();
            return g !== null;
        } catch (e) { throw util.error.dbError; }
    }

    static async getPrefix(guild) {
        let g;
        try {
            g = await GuildModel.findOne({id: guild.id}, 'pr').exec();
        } catch (e) { throw util.error.dbError; }
        if (g === null) {
            await Guild.add(guild);
            return config.discord.prefixDefault;
        } else if (g.pr === undefined) {
            await Guild.setPrefix(guild, config.discord.prefixDefault);
            return config.discord.prefixDefault;
        } else return g.pr;
    }
    
    static async setPrefix(guild, pr) {
        let g;
        try {
            g = await GuildModel.findOneAndUpdate({id: guild.id}, { $set: { pr: pr || config.discord.prefixDefault } }).exec();
        } catch (e) { throw util.error.dbError; }
        if (g === null) {
            await Guild.add(guild, {pr: pr || config.discord.prefixDefault});
        }
    }

    /*
        function(guildID, prefix) {
            return new Promise(function(res, rej) {
                //C.logTest('Changing prefix to' + prefix);
                Guild.updateOne({ id: guildID }, { $set: { pr: prefix || config.prefixDefault } }, function(err, guild) {
                    if (err) rej(util.error.dbError);
                    //else if (guild === null) rej(util.error.guildNotFound);
                    else res(prefix);
                });
            });
        }
    */

}

module.exports = Guild;
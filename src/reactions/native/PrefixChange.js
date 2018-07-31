const Command = require('../Command.js');
//const Prefixes = require('../../data/Data.js').guilds.prefixes;
const Prefix = require('../../obj/Prefix.js');
const Parser = require('../CommandParser.js');
const util = require('../../util/util.js');
const C = require('../../util/console.js');

class PrefixChangeCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        //console.log(msg.content);
        let args = Parser.parseArgs(msg.content, cmdData.prefix);

        Prefix.set(msg.guild, args[1]).then((pr) => {
            msg.channel.send('', {
                "embed": {
                    "title": "Prefix successfully changed to ' `" + pr + "` '.",
                    "color": util.embed.colourSuccess
                }
            }).catch(C.logError);
        }).catch(err => {
            C.logError(err);
            msg.channel.send('', {
                "embed": {
                    "title": "Error connecting with Demos database, please try again.",
                    "color": util.embed.colourError
                }
            }).catch(C.logError);
        });
        /*new Promise((res, rej) => {

            Prefixes.set(msg.guild.id, args[1]);
            require('../../db/actions/GuildUpdatePrefix.js')(msg.guild, args[1]).then((pr) => {
                Prefixes.set(msg.guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    require('../../db/actions/GuildAdd.js')(msg.guild, args[1]).then(guild => {
                        Prefixes.set(msg.guild.id, pr);
                        res(guild.pr);
                        return;
                    }).catch(err => {
                        rej(err);
                    });
                } else {
                    rej(err);
                }
            });
        }).then((pr) => {
            msg.channel.send('', {
                "embed": {
                    "title": "Prefix successfully changed to ' `" + pr + "` '.",
                    "color": util.embed.colourSuccess
                }
            }).catch(C.logError);
        }).catch(err => {
            C.logError(err);
            msg.channel.send('', {
                "embed": {
                    "title": "Error connecting with Demos database, please try again.",
                    "color": util.embed.colourError
                }
            }).catch(C.logError);
        });*/
    }
}

/*
        return new Promise((res, rej) => {
            let prefix = CommandTree.prefixList.get(msg.guild.id);
            if (prefix !== undefined) {
                res(prefix);
                //C.logTest('found prefix through memory');
            } else require('../db/actions/GuildGetPrefix.js')(msg.guild).then((pr) => {
                CommandTree.prefixList.set(msg.guild.id, pr);
                res(pr);
                return;
            }).catch(err => {
                if (err === util.error.guildNotFound) {
                    require('../db/actions/GuildAdd.js')(msg.guild).then(guild => {
                        CommandTree.prefixList.set(msg.guild.id, guild.pr);
                        res(guild.pr);
                        return;
                    }).catch(err => {
                        rej(err);
                    });
                } else {
                    rej(err);
                }
            });
        });*/

module.exports = PrefixChangeCommand;

const Prefix = require('demos-db/discord/prefix');
const Perms = require('demos-db/discord/perms');
const config = require('demos-config');
const Parser = require('demos-util/discord/cmdParser');

class MessageInfo {
    static applyCmdData(data) {
        if (data.message.content.startsWith(data.prefix)) {
            data.cmd = true;
            data.name = Parser.getName(data.message.content, data.prefix);
            data.cmdArgs = Parser.getArgs(data.message.content, data.prefix);
            data.full = data.message.content.substring(data.prefix.length);
        } else {
            data.cmd = false;
        }
    }

    static async stop(data, next) {
        data.inGuild = data.message.channel.type === 'text';
        data.perms = null;
        data.getPerms = async function() {
            if (!data.inGuild) return null;
            else if (!(data.perms instanceof Perms)) {
                let ps = await Perms.get(data.message.member);
                data.perms = ps;
            }
            return data.perms;
        }/*function() {
            return new Promise((res, rej) => {
                if (!data.inGuild) res(null);
                else if (Perms.prototype.isPrototypeOf(data.perms)) res(data.perms);
                else {
                    Perms.get(data.message.member).then(ps => {
                        data.perms = ps;
                        res(ps);
                    }).catch(rej);
                }
            });
        }*/
        if (data.inGuild) {
            let pr = await Prefix.get(data.message.guild)
            data.prefix = pr;
        } else data.prefix = config.discord.prefixDefault;
        MessageInfo.applyCmdData(data);
        next();
    }
}

module.exports = MessageInfo.stop;

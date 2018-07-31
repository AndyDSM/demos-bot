const Stop = require('../router/Stop.js');
const Prefix = require('../obj/Prefix.js');
const Perms = require('../obj/Perms.js');
const config = require('../util/config.json');
const Parser = require('../reactions/CommandParser.js');

class MessageInfo {
    static applyCmdData(data) {
        if (data.message.content.startsWith(data.prefix)) {
            data.cmd = true;
            data.name = Parser.parseName(data.message.content, data.prefix);
            data.cmdArgs = Parser.parseArgs(data.message.content, data.prefix);
            data.full = data.message.content.substring(data.prefix.length);
        } else {
            data.cmd = false;
        }
    }

    static stop(data, next) {
        data.inGuild = data.message.channel.type === 'text';
        data.perms = null;
        data.getPerms = function() {
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
        }
        if (data.inGuild) {
            Prefix.get(data.message.guild).then(pr => {
                data.prefix = pr;
                MessageInfo.applyCmdData(data);
                next();
            })
        } else {
            data.prefix = config.prefixDefault;
            MessageInfo.applyCmdData(data);
            next();
        }
    }
}

module.exports = MessageInfo.stop;

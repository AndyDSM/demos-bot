const C = require('../util/console.js');
const util = require('../util/util.js');
const ChannelStates = require('./States.js').channels;
//const Prefixes = require('../data/Data.js').guilds.prefixes;
const Prefix = require('./Prefix.js');
const Parser = require('./CommandParser.js');
const States = require('./States.js');

class CommandTree {

    static run(msg) {
        //console.log(Prefix);
        Prefix.get(msg.guild).then(prefix => {
            return States.channels.getStateRouter(msg.channel.id).run(msg).then(handled => {
                //console.log('saf');
                if (handled) return true;
                else {
                    if (!msg.content.startsWith(prefix)) return;
                    let name = Parser.parseName(msg.content, prefix);
                    let f = CommandTree.list.get(name);
                    //console.log(Object.keys(f));
                    if (f === undefined) return;
                    else f.run(msg, prefix);
                }
            }).catch(e => C.logError(e));
        }).catch(e => C.logError(e));
    }
}

CommandTree.list = new Map([
    ['ping', new(require('./native/Ping.js'))()],
    ['prefix', new(require('./native/PrefixChange.js'))()],
    ['ar-colour', new(require('./native/RoleAccessoryColour.js'))()],
    ['ar-name', new(require('./native/RoleAccessoryName.js'))()],
    ['dank', new(require('./native/PollNew.js'))()],
]);

module.exports = CommandTree;

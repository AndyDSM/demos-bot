const Command = require('../../Command.js');
const C = require('../../../util/console.js');
const Parser = require('../../CommandParser.js');
const Perms = require('../../Perms.js');

class ColourCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        //console.log(msg.content);
        let args = Parser.parseArgs(msg.content, cmdData.prefix);
        Perms.addMemberPerms(msg.member, args.splice(1)).then(() => {
            msg.channel.send('added').catch(C.logError);
        });
    }
}

module.exports = ColourCommand;

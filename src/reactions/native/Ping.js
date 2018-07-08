const Command = require('../Command.js');
//const CommandTree = require('../../commands/Tree.js');
const C = require('../../util/console.js');
//C.logTest(CommandTree);

class PingCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        C.logDev('pinged');
        msg.reply('pong');
    }
}

module.exports = PingCommand;

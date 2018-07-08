const Command = require('../Command.js');
const C = require('../../util/console.js');
const PollState = require('../states/Poll.js');
const ChannelStates = require('../States.js').channels;

class PingCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        ChannelStates.addState(msg.channel.id, new PollState());
        msg.reply('started the fuckin holocaust');
    }
}

module.exports = PingCommand;

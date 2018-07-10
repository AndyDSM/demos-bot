const Command = require('../../Command.js');
const C = require('../../../util/console.js');
const PollState = require('./PollState.js');
const ChannelStates = require('../../States.js').channels;
const Parser = require('../../CommandParser.js');

class PollCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        let args = Parser.parseCmdsConcatTerms(msg.content, cmdData.prefix);
        let q = args.get('q');
        let o = args.get('o');
        let pollArgs = {
            ch: msg.channel.id,
            q: (q === undefined || q[0] === undefined ? '?' : q[0]),
            o: (o === undefined ? '?' : o),
            u: msg.author.id
        };
        let state = new PollState();
        state.start(pollArgs, msg);
        ChannelStates.addState(msg.channel.id, state);
        //msg.reply('Started the poll.');
    }
}

module.exports = PollCommand;

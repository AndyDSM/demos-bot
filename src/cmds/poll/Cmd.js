const Command = require('../../cmd/Command.js');
const Prefix = require('../../obj/Prefix.js');
const Parser = require('../../reactions/CommandParser.js');
const util = require('../../util/util.js');
const C = require('../../util/console.js');
const Embed = require('../../util/embed.js');
const States = require('../../state/States.js');
const Router = require('../../router/Main.js').Router;
const PollState = require('./PollState.js');

let PollRouter = new Router();

PollRouter.stop((data, next) => {
    let args = Parser.parseCmdsConcatTerms(data.message.content, data.prefix);
    let q = args.get('q');
    let o = args.get('o');
    let pollArgs = {
        ch: data.message.channel.id,
        q: (q === undefined || q[0] === undefined ? '?' : q[0]),
        o: (o === undefined ? [] : o),
        u: data.message.author.id,
        showTotal: args.has('showTotal')
    };
    let state = new PollState();
    console.log('dn');
    state.start(pollArgs, data.message).then(() => {
        console.log('do');
        States.channelRouter.stop(data.message.channel.id, state.route);
    });
    next();
});

let PollCommand = new Command('poll', PollRouter, {
    desc: 'Hold a vote on the server.'
});

module.exports = PollCommand;

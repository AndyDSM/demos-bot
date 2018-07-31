let D = require('../router/Main.js');
let util = require('../util/util.js');
let Embed = require('../util/embed.js');
let CommandSet = require('../cmd/CommandSet.js');
let States = require('../state/States.js');

let MessageRoute = new D.Router();
MessageRoute.stop('message', (data, next) => {
    next(!data.message.author.bot);
});
MessageRoute.stop('message', require('../stop/MessageInfo.js'));
MessageRoute.stop('message', (data, next) => {
    console.log('data.name:', data.name);
    next();
});
let CommandSet_ = new CommandSet();
CommandSet_.addCmd('hey', (data, next) => {
    console.log('the \'hey\' command works');
    data.message.channel.send('hello there');
    next();
});
CommandSet_.addCmd('heydsg', (data, next) => {
    console.log('this shouldnt work');
    //data.message.channel.send('hello there');
    next();
});
CommandSet_.addCmd('addTestState', (data, next) => {
    data.message.channel.send('adding');
    States.channelRouter.stop(data.message.channel.id, (data, next) => {
        try {
            if (!data.message.author.bot) {
                if (data.message.content === 'stop') {
                    data.deleteStop();
                    data.message.channel.send('aight ill stop');
                } else data.message.channel.send('lol yeah');
            }
        } catch (e) {
            data.message.channel.send('lol yeah');
        }
        next();
    });
    next();
});
CommandSet_.addCmd(require('../cmds/colour/Colour.js'));
CommandSet_.addCmd(require('../cmds/ar/AccessoryRole.js'));
CommandSet_.addCmd(require('../cmds/prefix/Prefix.js'));
CommandSet_.addCmd(require('../cmds/poll/Cmd.js'));
CommandSet_.addCmd(require('../cmds/leven/Leven.js'));

let Commander = new D.Router();
Commander.keyer(data => (data.name === undefined ? util.symbol.skipRouter : data.name));
Commander.stops(CommandSet_);
Commander.continue({
    empty: true,
    nonEmpty: false,
    bubble: false,
});

MessageRoute.stop('message', Commander);

MessageRoute.stop('message', (data, next) => {
    if (data.cmd) Embed.sendError(data.message.channel, 'Invalid Command.');
    next();
});

module.exports = MessageRoute;

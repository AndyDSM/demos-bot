const db = require('./db/DB.js');
const C = require('./util/console.js');
const config = require('./util/config.json');
const util = require('./util/util.js');
const client = require('./disc/Discord.js');
const Router = require('./reactions/Router.js');
const Parser = require('./reactions/CommandParser.js');

const D = require('./router/Main.js');

db.p.then(() => {

    client.on('error', e => { C.logError('Error', e) });
    client.on('disconnect', e => { C.logError('Disconnected', e) });
    client.on('reconnecting', e => { C.logError('Reconnecting', e) });
    client.on('warn', e => { C.logError('Warn', e) });
    client.on('resume', e => { C.log('Resume Connection', e) });

    client.on('ready', () => {
        C.log(`Logged in as ${client.user.tag}`);
        //C.log(client.guilds.get('462055788790284319'));
        //C.log(client.guilds);
    });

    client.on('guildCreate', (guild) => {
        require('./db/actions/GuildCheckById.js')(guild).then(exists => {
            if (!exists) require('./db/actions/GuildAdd.js')(guild).catch();
        }).catch();
    });

    let States = require('./state/States.js');
    let DR = D(client);

    client.on('message', msg => {
        if (msg.author.bot) return;
        //if (msg.content.startsWith())
        //Router.run('message', msg);
    });

    //client.login(config.discToken);

    DR.stop(States.userRouter);
    DR.stop(States.channelRouter);
    DR.stop(States.guildRouter);
    DR.stop('ready', (data, next) => {
        console.log(data.key, 'hmm');
        data.meme = 'yup, that\'s right';
        setTimeout(function() {
            console.log(data.key, 'hell yeah');
            next();
        }, 2000);
    });
    DR.stop('ready', (data, next) => {
        console.log('god okay');
        console.log(data.meme);
        next();
    });

    DR.stop('message', require('./route/Message.js'));

    /*DR.stop('message', require('./stop/MessageInfo.js'));

    let Commander = new D.Tree([
        ['hey', (data, next) => {
            console.log('the \'hey\' command works');
            next();
        }]
    ]);
    Commander.keyer(data => data.name);
    Commander.continue(true);

    DR.stop('message', Commander);

    DR.stop('message', (data, next) => {
        console.log(data.message.content);
        next();
    });*/
    DR.login(config.discToken);

}).catch((err) => {
    C.logError(err);
});

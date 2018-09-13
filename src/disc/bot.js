const DB = require('demos-db/start');
const C = require('demos-console');
const util = require('demos-util');
const config = require('demos-config');
const client = require('demos-discClient');
const States = require('./state/States.js');

const D = require('djs-router');

//DB(config.db).then(async () => {

    let DR = D(client);

    DR.stop('ready', (data, next) => {
        C.log('Logged into Discord');
        next();
    });

    let Guild = require('demos-db/discord/guild');
    DR.stop('guildCreate', async (data, next) => {
        Guild.create(data.guild);
        next();
    });

    DR.stop(States.userRouter);
    DR.stop(States.channelRouter);
    DR.stop(States.guildRouter);

    DR.stop('message', require('./route/Message.js'));
    DR.login(config.discord.token);

//}).catch(C.logError);

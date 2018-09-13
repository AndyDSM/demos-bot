const Command = require('djs-router/cmd');
const Parser = require('demos-util/discord/cmdParser');
const util = require('demos-util');
const C = require('demos-console');
const Embed = require('demos-util/discord/embed');
const Router = require('djs-router').Router;

let AdminRouter = new Router();

let ArgRouter1 = new Router();

ArgRouter1.stop(/^p(erms|)$/, require('./perms.js'));
ArgRouter1.stop('log', (data, next) => {
    C.log('Logging:',data.cmdArgs.slice(2).reduce((a,x) => a+' '+x));
    next();
});
ArgRouter1.stop(/^ch(annel|)$/, require('./channel.js'));

ArgRouter1.keyer(data => data.cmdArgs[1]);

AdminRouter.stop(ArgRouter1);
/*AdminRouter.stop(async (data, next) => {
    let perms = await data.getPerms();
    await Embed.sendSuccess(data.message.channel, 'perms:' + perms.allPerms.toString());
    next();
});*/

let AdminCommand = new Command(/^a(dmin|)$/, AdminRouter, {
    desc: 'Change server prefix.'
});

module.exports = AdminCommand;

const Command = require('djs-router/cmd');
const Prefix = require('demos-db/discord/prefix');
const util = require('demos-util');
const C = require('demos-console');
const Embed = require('demos-util/discord/embed');
const Router = require('djs-router').Router;

let PrefixRouter = new Router();

PrefixRouter.stop(async (data, next) => {
    try {   
        let pr = await Prefix.set(data.message.guild, data.cmdArgs[1]);
        await Embed.sendSuccess(data.message.channel, "Prefix successfully changed to ' `" + pr + "` '.");
    } catch (err) {
        C.logError(err);
        await Embed.sendError(data.message.channel, "Error connecting with Demos database, please try again.");
    }
    next();
});

/*PrefixRouter.stop((data, next) => {
    Prefix.set(data.message.guild, data.cmdArgs[1]).then(pr => {
        Embed.sendSuccess(data.message.channel, "Prefix successfully changed to ' `" + pr + "` '.");
    }).catch(err => {
        C.logError(err);
        Embed.sendError(data.message.channel, "Error connecting with Demos database, please try again.");
    });
    next();
});*/

let PrefixCommand = new Command(/^prefix$|^pr$/, PrefixRouter, {
    desc: 'Change server prefix.'
});

module.exports = PrefixCommand;

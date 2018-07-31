const Command = require('../../cmd/Command.js');
const Prefix = require('../../obj/Prefix.js');
const Parser = require('../../reactions/CommandParser.js');
const util = require('../../util/util.js');
const C = require('../../util/console.js');
const Embed = require('../../util/embed.js');
const Router = require('../../router/Main.js').Router;

let PrefixRouter = new Router();

PrefixRouter.stop((data, next) => {
    Prefix.set(data.message.guild, data.cmdArgs[1]).then(pr => {
        Embed.sendSuccess(data.message.channel, "Prefix successfully changed to ' `" + pr + "` '.");
    }).catch(err => {
        C.logError(err);
        Embed.sendError(data.message.channel, "Error connecting with Demos database, please try again.");
    });
    next();
});

let PrefixCommand = new Command(/^prefix$|^pr$/, PrefixRouter, {
    desc: 'Change server prefix.'
});

module.exports = PrefixCommand;

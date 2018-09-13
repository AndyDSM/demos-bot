const Router = require('djs-router').Router;
const Embed = require('demos-util/discord/embed');
const Channel = require('demos-db/discord/channel');
const C = require('demos-console');

let ChannelRouter = new Router();

ChannelRouter.stop((data, next) => {
    let argStr = data.cmdArgs.slice(2).reduce((a,x) => a+' '+x);
    let testStr = '';
    if (argStr.startsWith("\"")) testStr = argStr.substring(1).match(/^[^"]*/)[0];
    else testStr = data.cmdArgs[2];
    let channels = Channel.fromText(testStr, data.message.guild); 
    //C.logDev(channels);
    Embed.sendSuccess(data.message.channel, (channels !== null ? channels[0].name : 'null'));
    next();
});

module.exports = ChannelRouter;
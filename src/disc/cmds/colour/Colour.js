const Command = require('djs-router/cmd');
const Router = require('djs-router').Router;
const C = require('demos-console');
const util = require('demos-util');
const u = require('util');
const Jimp = require('jimp');
const fs = require('fs');
const tinycolor = require('tinycolor2');
const Parser = require('demos-util/discord/cmdParser');
const Embed = require('demos-util/discord/embed');

let ColourRouter = new Router();

ColourRouter.stop(async (data, next) => {
    let colour = tinycolor(Parser.getArgsRaw(data.message.content, data.prefix));
    if (colour.isValid()) {
        try {
            let image = await new Promise((res,rej) => new Jimp(100, 100, parseInt(colour.toHex8(), 16), (err, image) => (err?rej(err):res(image))));
            let name = 'image' + util.uuid() + '.' + image.getExtension();
            let path = __dirname + '/' + name;
            await new Promise((res, rej) => image.write(path, err => (err?rej(err):res())));
            await data.message.channel.send({
                embed: {
                    title: "Colour ' `" + colour.getOriginalInput() + "` '.",
                    image: {
                        "url": 'attachment://' + name
                    },
                    color: parseInt(colour.toHex(), 16)
                },
                files: [{
                    attachment: path,
                    name: name
                }]
            });
            await u.promisify(fs.unlink)(path);
            next();
        } catch (err) { C.logError(err); await Embed.sendError(data.message.channel, 'Error generating colour image.'); next(); }
    } else { await Embed.sendError(data.message.channel, 'Invalid colour format.'); next(); }
});

/* 

ColourRouter.stop((data, next) => {
    let colour = tinycolor(Parser.parseMsg(data.message.content, data.prefix));
    if (colour.isValid()) {
        new Jimp(100, 100, parseInt(colour.toHex8(), 16), function(err, image) {
            let name = 'image' + uuid() + '.' + image.getExtension();
            let path = __dirname + '/' + name;
            image.write(path, () => {
                data.message.channel.send({
                    embed: {
                        title: "Colour ' `" + colour.getOriginalInput() + "` '.",
                        image: {
                            "url": 'attachment://' + name
                        },
                        color: parseInt(colour.toHex(), 16)
                    },
                    files: [{
                        attachment: path,
                        name: name
                    }]
                }).then(() => {
                    fs.unlink(path, () => {});
                }).catch(C.logError);
            });
        });
    } else {
        Embed.sendError(data.message.channel, 'Invalid colour format.');
    }
    next();
});

*/

let ColourCommand = new Command(/^colour$|^color$|^clr$/, ColourRouter, {
    desc: 'Returns the colour in image form.'
});

module.exports = ColourCommand;

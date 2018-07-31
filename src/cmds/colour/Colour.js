const Command = require('../../cmd/Command.js');
const Router = require('../../router/Main.js').Router;
const C = require('../../util/console.js');
const uuid = require('../../util/id.js');
const util = require('../../util/util.js');
const Jimp = require('jimp');
const fs = require('fs');
const tinycolor = require('tinycolor2');
const Parser = require('../../reactions/CommandParser.js');
const Embed = require('../../util/embed.js');

let ColourRouter = new Router();

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

let ColourCommand = new Command(/^colour$|^color$|^clr$/, ColourRouter, {
    desc: 'Returns the colour in image form.'
});

module.exports = ColourCommand;

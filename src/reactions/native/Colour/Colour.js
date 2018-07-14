const Command = require('../../Command.js');
//const CommandTree = require('../../commands/Tree.js');
const C = require('../../../util/console.js');
const uuid = require('../../../util/id.js');
const util = require('../../../util/util.js');
const Jimp = require('jimp');
const fs = require('fs');
const tinycolor = require('tinycolor2');
const Parser = require('../../CommandParser.js');
//C.logTest(CommandTree);

class ColourCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        let colour = tinycolor(Parser.parseMsg(msg.content, cmdData.prefix));
        if (colour.isValid()) {
            new Jimp(100, 100, parseInt(colour.toHex8(), 16), function(err, image) {
                let name = 'image' + uuid() + '.' + image.getExtension();
                let path = __dirname + '/' + name;
                image.write(path, () => {
                    msg.channel.send({
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
            msg.channel.send('', {
                "embed": {
                    "title": "Invalid colour format.",
                    "color": util.embed.colourError
                }
            }).catch(C.logError);
        }
        //C.logDev(__dirname);
        //msg.reply('fuck off');
    }
}

module.exports = ColourCommand;

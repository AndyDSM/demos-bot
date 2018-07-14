const Command = require('../../Command.js');
//const CommandTree = require('../../commands/Tree.js');
const C = require('../../../util/console.js');
const uuid = require('../../../util/id.js');
const util = require('../../../util/util.js');
const Jimp = require('jimp');
const fs = require('fs');
const tinycolor = require('tinycolor2');
const Parser = require('../../CommandParser.js');
const Perms = require('../../Perms.js');
//C.logTest(CommandTree);

class ColourCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        //C.logDev('yup');
        Perms.get(msg.member).then(perms_ => {
            //C.logDev(perms_);
            let r = ''
            for (let i = 0; i < perms_.allPerms.length; i++) {
                r += '\n\t[' + perms_.allPerms[i] + '],'
            }
            msg.channel.send('```js\n[' + r + '\n]\n```').catch(C.logError);
        })
    }
}

module.exports = ColourCommand;

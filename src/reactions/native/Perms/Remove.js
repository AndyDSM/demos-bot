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
        //console.log(msg.content);
        let args = Parser.parseArgs(msg.content, cmdData.prefix);
        Perms.removeMemberPerms(msg.member, args.splice(1)).then(() => {
            msg.channel.send('removed').catch(C.logError);
        })
    }
}

module.exports = ColourCommand;

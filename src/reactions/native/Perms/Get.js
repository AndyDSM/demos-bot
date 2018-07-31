const Command = require('../../Command.js');
const C = require('../../../util/console.js');
const Parser = require('../../CommandParser.js');

class ColourCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        //C.logDev('yup');
        cmdData.getPerms().then(perms_ => {
            C.logDev(perms_);
            let r = '';
            for (let i = 0; i < perms_.allPerms.length; i++) {
                r += '\n\t[' + perms_.allPerms[i] + '],';
            }
            msg.channel.send('```js\n[' + r + '\n]\n```').catch(C.logError);
        }).catch(C.logError);
    }
}

module.exports = ColourCommand;

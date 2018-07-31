// command tree handler
const ReactionState = require('./StateReaction.js');
const CommandTree = require('./CommandTree.js');
const util = require('../util/util.js');
const C = require('../util/console.js');
const Embed = require('../util/embed.js');

class CommandState extends ReactionState {
    constructor() {
        super();
        this.on('message', (cmdData, msg) => {
            //console.log(cmdData);
            if (cmdData.cmd === true) {
                Embed.sendError(msg.channel, 'Invalid Command.');
                /*msg.channel.send('', {
                    "embed": {
                        "title": "Invalid command.",
                        "color": util.embed.colourError
                    }
                }).catch(C.logError);*/
                return true;
            }
        });
    }
}

let r = new CommandState();

module.exports = r;

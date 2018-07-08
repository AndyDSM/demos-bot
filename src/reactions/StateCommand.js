// command tree handler
const ReactionState = require('./StateReaction.js');
const CommandTree = require('./CommandTree.js');

class CommandState extends ReactionState {
    constructor() {
        super();
        this.cmdTree = new CommandTree();
        this.on('message', (cmdData, msg) => {
            //console.log(cmdData);
            if (cmdData.cmd === false) return false;
            return this.cmdTree.run(cmdData, msg);
        });
    }
}

module.exports = CommandState;

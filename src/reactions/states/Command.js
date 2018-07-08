// command tree handler
const State = require('../State.js');
const CommandTree = require('../CommandTree.js');

class CommandState extends State {
    constructor() {
        super();
        this.cmdTree = new CommandTree();
    }

    run(event, msg, cmdData) {
        if (event === 'message') {
            if (cmdData.cmd === false) return true;
            return this.cmdTree.run(cmdData, msg);
        }
        return false;
    }
}

module.exports = CommandState;

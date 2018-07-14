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

    query(func, i) {
        let r = i;
        for (let [name, cmd] of this.cmdTree.list[Symbol.iterator]()) {
            r = cmd.query(func, r);
        }
        return r;
    }
}

module.exports = CommandState;

// command tree handler
/*const State = require('../State.js');
const CommandTree = require('../CommandTree.js');

class DefaultState extends State {
    constructor() {
        super();
        this.cmdTree = new CommandTree([
            ['ping', new(require('../native/Ping.js'))()],
            ['prefix', new(require('../native/PrefixChange.js'))()],
            ['ar-colour', new(require('../native/RoleAccessoryColour.js'))()],
            ['ar-name', new(require('../native/RoleAccessoryName.js'))()],
            ['dank', new(require('../native/PollNew.js'))()],
        ]);
    }

    run(event, msg, cmdData) {
        if (event === 'message') {
            return this.cmdTree.run(cmdData, msg);
        }
    }
}

let r = new DefaultState();*/

const CommandState = require('./Command.js');
const CommandTree = require('../CommandTree.js');

let r = new CommandState();
r.cmdTree = new CommandTree([
    ['ping', new(require('../native/Ping.js'))()],
    ['prefix', new(require('../native/PrefixChange.js'))()],
    ['ar-colour', new(require('../native/RoleAccessoryColour.js'))()],
    ['ar-name', new(require('../native/RoleAccessoryName.js'))()],
    ['dank', new(require('../native/PollNew.js'))()],
]);

module.exports = r;

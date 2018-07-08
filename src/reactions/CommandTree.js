const Parser = require('./CommandParser.js');
const C = require('../util/console.js');

class CommandTree {

    constructor(cmds) {
        this.list = new Map(cmds);
    }

    run(cmdData, msg) {
        let f = this.list.get(cmdData.name);
        if (f === undefined) return false;
        else {
            f.run(cmdData, msg);
            return true;
        }

    }
}

/*CommandTree.list = new Map([
    ['ping', new(require('./native/Ping.js'))()],
    ['prefix', new(require('./native/PrefixChange.js'))()],
    ['ar-colour', new(require('./native/RoleAccessoryColour.js'))()],
    ['ar-name', new(require('./native/RoleAccessoryName.js'))()],
    ['dank', new(require('./native/PollNew.js'))()],
]);*/

module.exports = CommandTree;

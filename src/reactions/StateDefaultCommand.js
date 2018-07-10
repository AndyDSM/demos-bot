const CommandState = require('./StateCommand.js');
const CommandTree = require('./CommandTree.js');

let r = new CommandState();

r.cmdTree = new CommandTree([
    ['ping', new(require('./native/Ping.js'))()],
    ['prefix', new(require('./native/PrefixChange.js'))()],
    ['ar-colour', new(require('./native/RoleAccessoryColour.js'))()],
    ['ar-name', new(require('./native/RoleAccessoryName.js'))()],
    //['dank', new(require('./native/PollNew.js'))()],
    ['poll', new(require('./native/Poll/Poll.js'))()],
    ['ar', new(require('./native/RoleAccessory/RoleAccessory.js'))()],
]);

module.exports = r;

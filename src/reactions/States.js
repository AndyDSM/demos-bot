const StateMap = require('./StateMap.js');

let Data = {
    channels: new StateMap(),
    guilds: new StateMap(),
    users: new StateMap(),
}

module.exports = Data;

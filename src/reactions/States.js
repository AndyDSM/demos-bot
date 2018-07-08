const StateMap = require('./StateMap.js');

let Data = {
    channels: new StateMap(),
    guilds: new StateMap(),
}

module.exports = Data;

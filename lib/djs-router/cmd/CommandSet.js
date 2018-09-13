const Command = require('./Command.js');

class CommandSet extends Map {
    constructor() { super(...arguments); }

    toStops() {
        let r = [];
        for (let [k, v] of this[Symbol.iterator]()) {
            r.push([k, v.fnc]);
        }
        return r;
    }

    addCmd(key, fnc, i) {
        if (Command.prototype.isPrototypeOf(key)) this.set(key.key, key);
        else this.set(key, new Command(key, fnc, i));
    }

    addCmds(arr) {
        for (let cmd of arr) {
            this.set(cmd[0], new Command(cmd[0], cmd[1], cmd[2]));
        }
    }
}

module.exports = CommandSet;

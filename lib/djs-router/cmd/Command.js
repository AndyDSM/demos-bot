class Command {
    constructor(key, fnc = (d, n) => { n() }, i = {}) {
        this.key = key;
        this.fnc = fnc;
        this.i = i;
    }
}

module.exports = Command;

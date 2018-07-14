const Prefix = require('./Prefix.js');
const Parser = require('./CommandParser.js');
const Perms = require('./Perms.js');

class CommandData {
    constructor(msg) {
        this.msg = msg;
        this.guild = msg.channel.type === 'text';
        this.prefix = undefined;
        this.cmd = false;
        this.name = null;
        this.full = null;
        this.perms = null;
    }

    getPerms() {
        return new Promise((res, rej) => {
            if (this.guild) res(null);
            else if (Perms.prototype.isPrototypeOf(this.perms)) res(this.perms);
            else {
                Perms.get(this.msg.member).then(ps => {
                    this.perms = ps;
                    res(ps);
                }).catch(rej);
            }
        });
    }

    static get(msg) {
        let r = new CommandData(msg);
        return new Promise((res, rej) => {
            if (r.guild) Prefix.get(msg.guild).then(pr => {
                r.prefix = pr;
                if (msg.content.startsWith(pr)) {
                    r.cmd = true;
                    r.name = Parser.parseName(msg, prefix);
                    r.full = msg.substring(prefix.length);
                }
                res(r);
            }).catch(rej);
            else res(r);
        });
    }
}

module.exports = CommandData;

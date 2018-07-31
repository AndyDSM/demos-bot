const Prefix = require('../obj/Prefix.js');
const Parser = require('./CommandParser.js');
const Perms = require('../obj/Perms.js');
const config = require('../util/config.json');
const C = require('../util/console.js');

class CommandData {
    constructor(msg) {
        this.msg = msg;
        this.guild = msg.channel.type === 'text';
        this.prefix = undefined;
        this.cmd = false;
        this.name = null;
        this.args = null;
        this.full = null;
        this.perms = null;
    }

    getPerms() {
        return new Promise((res, rej) => {
            if (!this.guild) res(null);
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
                    r.name = Parser.parseName(msg.content, pr);
                    r.args = Parser.parseArgs(msg.content, pr);
                    r.full = msg.content.substring(pr.length);
                }
                res(r);
            }).catch(rej);
            else {
                r.prefix = config.prefixDefault;
                if (msg.content.startsWith(r.prefix)) {
                    r.cmd = true;
                    r.name = Parser.parseName(msg.content, r.prefix);
                    r.args = Parser.parseArgs(msg.content, r.prefix);
                    r.full = msg.content.substring(r.prefix.length);
                }
                res(r);
            }
        });
    }
}

module.exports = CommandData;

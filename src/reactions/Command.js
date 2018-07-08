class Command {
    constructor() {
        this.desc = '';
        this.guide = '';
    }

    run() {}

    parseCmds(msg, prefix) {
        let words = msg.content.substring(prefix.length).split(' ');
        let args = [['cmd', '']];
        for (let i = 0; i < words.length; i++) {
            if (words[i].charAt(0) === '-') args.push([words[i].substring(1), '']);
            else args[args.length - 1][1] += (args[args.length - 1][1].length === 0 ? '' : ' ') + words[i];
        }
        return args;
    }

    parseCmdsConcatTerms(msg, prefix) {
        let args = this.parseCmds(msg, prefix);
        let r = new Map();
        for (let i = 0; i < args.length; i++) {
            let curr = r.get(args[i][0]);
            if (curr === undefined) r.set(args[i][0], [args[i][1]]);
            else curr.push(args[i][1]);
        }
        return r;
    }

    parseArgs(msg, prefix) {
        return msg.content.substring(prefix.length).split(' ').filter(x => x !== '');
    }
    parseMsg(msg, prefix) {
        return msg.content.substring(msg.content.search(/ /) + 1);
    }
}

module.exports = Command;

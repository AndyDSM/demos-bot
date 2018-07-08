class CommandParser {

    static parseCmds(msg, prefix) {
        let words = msg.substring(prefix.length).split(' ');
        let args = [['cmd', '']];
        for (let i = 0; i < words.length; i++) {
            if (words[i].charAt(0) === '-') args.push([words[i].substring(1), '']);
            else args[args.length - 1][1] += (args[args.length - 1][1].length === 0 ? '' : ' ') + words[i];
        }
        return args;
    }

    static parseCmdsConcatTerms(msg, prefix) {
        let args = this.parseCmds(msg, prefix);
        let r = new Map();
        for (let i = 0; i < args.length; i++) {
            let curr = r.get(args[i][0]);
            if (curr === undefined) r.set(args[i][0], [args[i][1]]);
            else curr.push(args[i][1]);
        }
        return r;
    }

    static parseArgs(msg, prefix) {
        return msg.substring(prefix.length).split(' ').filter(x => x !== '');
    }

    static parseMsg(msg, prefix) {
        let spacePos = msg.search(/ /);
        if (spacePos !== -1) return msg.substring(spacePos + 1);
        return '';
    }

    static parseName(msg, prefix) {
        let end = msg.search(/ /);
        if (end !== -1) return msg.substring(prefix.length, end);
        return msg.substring(prefix.length);
    }

    static parseData(msg, prefix) {
        let r = {
            cmd: false,
            name: null,
            full: null,
            prefix: prefix
        };
        if (msg.startsWith(prefix)) {
            r.cmd = true;
            r.name = CommandParser.parseName(msg, prefix);
            r.full = msg.substring(prefix.length);
        }
        return r;
    }

    static mergeArgs(args, glue) {
        if (args.length === 0) return '';
        let r = args[0];
        for (let i = 1; i < args.length; i++) {
            r += (glue === undefined ? ' ' : glue) + args[i];
        }
        return r;
    }
}

module.exports = CommandParser;

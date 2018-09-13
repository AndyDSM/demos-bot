class Parser {

    static trimPrefix(msg, pr = '') {
        try {
            if (msg.startsWith(pr)) return msg.substring(pr.length);
            return msg;
        } catch (e) { return msg; }
    }

    static isCommand(msg, pr = '') {
        return (
            typeof msg === 'string' 
            && typeof pr === 'string' 
            && msg.startsWith(pr)
            && msg.substring(pr.length).match(/^\S/) !== null
        )
    }

    static getArgs(msg, pr = '') {
        try {
            return msg.substring(pr.length).match(/\S+/g);
        } catch (e) { return null; }
    }

    static getName(msg, pr = '') {
        try {
            return msg.match(new RegExp('^' + pr + '\\S+'))[0].substring(pr.length);
        } catch (e) { return null; }
    }

    static getArgsRaw(msg, pr = '') {
        try { 
            return msg.substring(msg.search(/ /) + 1);
        } catch (e) { return ''; }
    }

    static getParams(msg) {
        if (typeof msg !== 'string') return null;
        let args = Parser.getArgs(msg).splice(1);
        let r = [['__root']];
        for (let w of args) {
            if (w.startsWith('-')) r.push([w.substring(1)]);
            else r[r.length-1].push(w);
        }
        return r;
    }

    static getPackedParams(msg) {
        let params = Parser.getParams(msg);
        let r = new Map();
        for (let p of params) {
            let r_ = r.get(p[0]);
            if (r_ === undefined) { r_ = []; r.set(p[0], r_) }
            r_.push(p.splice(1));
        }
        return r;
    }
}

module.exports = Parser;
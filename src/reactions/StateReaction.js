const State = require('./State.js');
const ReactionMap = require('./ReactionMap.js');
const C = require('../util/console.js');

class ReactionState extends State {
    constructor() {
        super();
        this.reactions = new ReactionMap();
    }

    run() {
        let args = arguments;
        return new Promise((res, rej) => {
            try {
                let event = args[0];
                let args_ = Array.from(args).splice(1);
                let r = this.reactions.getReaction(event)(...args_);
                //console.log(event, args_, this.reactions.getReaction(event), r);
                if (Promise.prototype.isPrototypeOf(r)) r.then(r => { res(r === true); }).catch(e => {
                    C.logError(e);
                    res(false)
                });
                else res(r === true);
            } catch (e) {
                C.logError(e);
                res(false)
            };
        });
    }

    on(event, f) {
        this.reactions.set(event, f);
        return this;
    }
}

module.exports = ReactionState;

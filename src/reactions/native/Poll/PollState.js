const State = require('../../State.js');
const util = require('../../../util/util.js');
const C = require('../../../util/console.js');

class PollState extends State {
    constructor() {
        super();
        this.props = {};
        this.msg = null;
    }

    static genEmbed(props) {
        let results = '';
        let total = 0;
        for (let i = 0; i < props.vc.length; i++) {
            if (typeof props.vc[i] === "number") total += props.vc[i];
        }
        for (let i = 0; i < props.o.length; i++) {
            results += '`' + (i + 1) + '` - ' + props.o[i] + ' | `' + (props.vc[i] !== undefined ? props.vc[i] : 0) + ' votes, ' + (total > 0 ? (100 * props.vc[i] / total).toFixed(1) : '0.0') + '%`\n'
        }
        return {
            "title": props.q,
            "description": results,
            "color": 16770915,
            "footer": {
                "text": "Reply with a number 1 - " + props.o.length + " to vote." // + Math.random()
            }
        }
    }

    start(pollProps, msg) {
        let that = this;
        require('../../../db/actions/PollAdd.js')(pollProps).then((props) => {
            that.props = props;
            return msg.channel.send('', { embed: PollState.genEmbed(props) });
        }).catch(C.logError).then((msg_) => {
            //console.log('hey');
            that.msg = msg_;
        });
    }

    voteFor(userid, no) {
        let that = this;
        return new Promise((res, rej) => {
            require('../../../db/actions/PollGet.js')(that.props.id).then((poll) => {
                that.props.vc = poll.vc;
                //console.log('got here1', that.props.vc);
                require('../../../db/actions/VoteGet.js')(that.props.id, userid).then(vote => {
                    //console.log('got here2', vote);
                    require('../../../db/actions/VoteUpdateOption.js')(that.props.id, userid, no).then(o => {
                        //console.log('got here3', o);
                        if (that.props.vc[o] !== undefined) that.props.vc[o]++;
                        if (that.props.vc[vote.o] !== undefined) {
                            that.props.vc[vote.o]--;
                            if (that.props.vc[vote.o] < 0) that.props.vc[vote.o] = 0;
                        }
                        //console.log(that.props.vc);
                        require('../../../db/actions/PollUpdateCount.js')(that.props.id, that.props.vc).then(o_ => {
                            //console.log('got here4', o_);
                            res();
                        }).catch(e => { rej(e) });
                        // remove option from vote, add from o
                    }).catch(e => { rej(e) });
                }).catch(err => {
                    //console.log('got here5', err);
                    if (err === util.error.voteNotFound) require('../../../db/actions/VoteAdd.js')(that.props.id, userid, no).then(o => {
                        //console.log('got here6', o);
                        if (that.props.vc[o.o] !== undefined) that.props.vc[o.o]++;
                        //console.log(that.props.vc);
                        require('../../../db/actions/PollUpdateCount.js')(that.props.id, that.props.vc).then(o_ => {
                            //console.log('got here7', o_);
                            res();
                        }).catch(e => { rej(e) });
                    }).catch(e => { rej(e) });
                });
            }).catch(e => { rej(e) });;
        });
    }

    run(event, cmdData, msg) {
        //console.log(msg.content);
        if (event === 'message') {
            msg.delete();
            try {
                let vote = parseInt(msg.content);
                //console.log(vote, this.props.o.length);
                if (0 < vote && vote < this.props.o.length + 1) {
                    this.voteFor(msg.author.id, vote - 1).then(() => {
                        if (this.msg !== null) {
                            this.msg.edit({ embed: PollState.genEmbed(this.props) }).catch(C.logError);
                        }
                    }).catch(C.logError);
                }
            } catch (e) { C.logError(e) };
            if (msg.content === 'stop') {
                msg.reply('Poll closed.');
                this.delete();
            }
            return true;
        }
    }
}

module.exports = PollState;

const Poll = require('demos-db/discord/poll');
const C = require('demos-console');
const Router = require('djs-router').Router;
const config = require('demos-config');

class PollState {
    constructor() {
        let that = this;
        that.route = new Router();
        that.route.stop((data, next) => {
            if (data.keys[0] === 'message') {
                if (data.message.author.id !== config.discord.botID) data.message.delete();
                try {
                    let vote = parseInt(data.message.content);
                    //console.log(vote, this.props.o.length);
                    if (0 < vote && vote < that.props.o.length + 1) {
                        Poll.vote(that.props.id, data.message.author.id, vote - 1).then(vc => {
                            that.props.vc = vc;
                            if (that.msgEmbed !== null) {
                                that.msgEmbed.edit({ embed: PollState.genEmbed(that.props) }).catch(C.logError);
                            }
                        }).catch(C.logError);
                    }
                } catch (e) { C.logError(e) };
                if (data.message.content === 'stop') {
                    Poll.delete(that.props.id);
                    data.message.reply('Poll closed.');
                    data.deleteStop();
                }
                next(false);
            } else next();
        });

    }

    static genEmbed(props) {
        let desc = '';
        let total = props.vc.reduce((a, v) => a + v);
        let results = '';
        let longestResult = '';
        for (let i = 0; i < props.o.length; i++) {
            let next = (i + 1) + ': ' + props.o[i] + ' | ' + (props.vc[i] !== undefined ? props.vc[i] : 0) + ' votes, ' + (total > 0 ? (100 * props.vc[i] / total).toFixed(1) : '0.0') + '%';
            if (next.length > longestResult) longestResult = next.length;
            results += next + '\n';
        }
        if (props.showTotal) results += 'Total votes: ' + total + '\n';
        desc += '`' + ('').padStart(longestResult + 8, '-') + '`\n```LiveScript\n' + results + '```';
        return {
            "title": props.q,
            "description": desc,
            "color": 16770915,
            "footer": {
                "text": "Reply with a number 1 - " + props.o.length + " to vote." // + Math.random()
            }
        }
    }

    async start(args, msg) {
        this.props = args;
        this.msgOriginal = msg;
        this.msgEmbed;
        this.props = await Poll.create(args);
        this.msgEmbed = await msg.channel.send({ embed: PollState.genEmbed(props) } );
        return;
    }
}

module.exports = PollState;

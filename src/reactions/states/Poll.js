const State = require('../State.js');

class PollState extends State {
    constructor() {
        super();
    }

    run(event, cmdData, msg) {
        //console.log(msg.content);
        if (msg.content === 'stop') {
            msg.reply('aight ill stop');
            this.delete();
        } else msg.reply('shut up cuck');
        return false;
    }
}

module.exports = PollState;

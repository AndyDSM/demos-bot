const PollGet = require('../_actions/PollGet.js'),
    PollUpdateCount = require('../_actions/PollUpdateCount.js'),
    VoteGet = require('../_actions/VoteGet.js'),
    VoteUpdateOption = require('../_actions/VoteUpdateOption.js'),
    VoteAdd = require('../_actions/VoteAdd.js'),
    util = require('demos-util');

class Poll {

    static async vote(pollid, userid, no) { // returns total vote count for all options
        let poll = await PollGet(pollid), vc = poll.vc, vote;
        try { vote = await VoteGet(pollid, userid); } catch (err) {
            if (err === util.error.voteNotFound) {
                let o_ = await VoteAdd(pollid, userid, no)
                if (vc[o_.o] !== undefined) vc[o_.o]++;
                await PollUpdateCount(pollid, vc);
                return vc;
            } else throw err;
        }
        let o_ = await VoteUpdateOption(pollid, userid, no);
        if (vc[o_] !== undefined) vc[o_]++;
        if (vc[vote.o] !== undefined) {
            vc[vote.o]--;
            if (vc[vote.o] < 0) vc[vote.o] = 0;
        } 
        await PollUpdateCount(pollid, vc);
        return vc;
    }

    /*static vote(pollid, userid, no) { // returns total vote count for all options
        return new Promise((res, rej) => {
            PollGet(pollid).then(poll => {
                let vc = poll.vc;
                VoteGet(pollid, userid).then(vote => {
                    VoteUpdateOption(pollid, userid, no).then(o_ => {
                        if (vc[o_] !== undefined) vc[o_]++;
                        if (vc[vote.o] !== undefined) {
                            vc[vote.o]--;
                            if (vc[vote.o] < 0) vc[vote.o] = 0;
                        }
                        PollUpdateCount(pollid, vc).then(o_ => { res(vc); }).catch(rej);
                    }).catch(rej);
                }).catch(err => {
                    if (err === util.error.voteNotFound) VoteAdd(pollid, userid, no).then(o_ => {
                        if (vc[o_.o] !== undefined) vc[o_.o]++;
                        PollUpdateCount(pollid, vc).then(o_ => { res(vc); }).catch(rej);
                    }).catch(rej);
                });
            }).catch(rej);
        });
    }*/

    static async delete(pollid) {
        await Promise.all([
            require('../_actions/PollDelete.js')(pollid),
            require('../_actions/VotesDelete.js')(pollid)
        ]);
        return;
    }
}

Poll.create = require('../_actions/PollAdd.js');

module.exports = Poll;

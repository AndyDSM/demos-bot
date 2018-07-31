const PollGet = require('../../db/actions/PollGet.js'),
    PollUpdateCount = require('../../db/actions/PollUpdateCount.js'),
    VoteGet = require('../../db/actions/VoteGet.js'),
    VoteUpdateOption = require('../../db/actions/VoteUpdateOption.js'),
    VoteAdd = require('../../db/actions/VoteAdd.js'),
    util = require('../../util/util.js');

class Poll {

    static vote(pollid, userid, no) { // returns total vote count for all options
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
    }

    static delete(pollid) {
        return Promise.all([
            require('../../db/actions/PollDelete.js')(pollid),
            require('../../db/actions/VotesDelete.js')(pollid)
        ]).then(() => {}).catch(() => {});
    }
}

Poll.create = require('../../db/actions/PollAdd.js');

module.exports = Poll;

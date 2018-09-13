const Poll = require('../_models/Poll.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(poll) {
    return new Promise(function(res, rej) {

        let vc = [];
        for (let i = 0; i < poll.o.length; i++) {
            vc.push(0);
        }
        let pollProps = Object.assign(poll, { id: util.uuid(), vc: vc, op: true });

        let pollItem = new Poll(pollProps);
        pollItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(pollProps);
        });
    });
}

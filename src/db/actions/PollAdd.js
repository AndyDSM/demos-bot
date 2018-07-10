const Poll = require('../models/Poll.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');
const uuid = require('../../util/id.js');

module.exports = function(poll) {
    return new Promise(function(res, rej) {

        let vc = [];
        for (let i = 0; i < poll.o.length; i++) {
            vc.push(0);
        }
        let pollProps = Object.assign(poll, { id: uuid(), vc: vc, op: true });

        let pollItem = new Poll(pollProps);
        pollItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(pollProps);
        });
    });
}

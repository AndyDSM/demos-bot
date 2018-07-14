const Member = require('../models/Member.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(uid, gid) {
    return new Promise(function(res, rej) {
        Member.findOne({ id: uid, g: gid }, 'ps', function(err, member) {
            if (err) rej(util.error.dbError);
            else if (member === null) res([]);
            else if (member.ps === undefined) res([]);
            else res(member.ps);
        });
    });
}

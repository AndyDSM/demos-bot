const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

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

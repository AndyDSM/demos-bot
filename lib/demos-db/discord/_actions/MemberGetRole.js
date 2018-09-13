const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(member) {
    return new Promise(function(res, rej) {
        Member.findOne({ id: member.id, g: member.guild.id }, 'r_ac', function(err, member) {
            if (err) rej(util.error.dbError);
            else if (member === null) rej(util.error.memberNotFound);
            else if (member.r_ac === undefined) rej(util.error.roleAccessoryNotFound);
            else res(member.r_ac);
        });
    });
}
